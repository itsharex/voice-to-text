// Демо-модуль для наглядной демонстрации state-sync между двумя Tauri окнами.
// Используется только в debug сборке при DEMO=1.

use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};
use tokio::sync::RwLock;

use crate::presentation::commands::SnapshotEnvelope;
use crate::presentation::events::{StateSyncInvalidationPayload, EVENT_STATE_SYNC_INVALIDATION};

// --- State ---

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DemoState {
    pub counter: i64,
    pub color: String,
    pub slider_value: u32,
    pub text: String,
}

impl Default for DemoState {
    fn default() -> Self {
        Self {
            counter: 0,
            color: "#3b82f6".to_string(),
            slider_value: 50,
            text: String::new(),
        }
    }
}

pub struct DemoAppState {
    pub state: Arc<RwLock<DemoState>>,
    pub revision: Arc<RwLock<u64>>,
}

impl Default for DemoAppState {
    fn default() -> Self {
        Self {
            state: Arc::new(RwLock::new(DemoState::default())),
            revision: Arc::new(RwLock::new(0)),
        }
    }
}

// --- Commands ---

#[tauri::command]
pub async fn get_demo_snapshot(
    state: State<'_, DemoAppState>,
) -> Result<SnapshotEnvelope<DemoState>, String> {
    let data = state.state.read().await.clone();
    let revision = state.revision.read().await.to_string();
    Ok(SnapshotEnvelope { revision, data })
}

#[tauri::command]
pub async fn update_demo_state(
    state: State<'_, DemoAppState>,
    app_handle: AppHandle,
    counter: Option<i64>,
    color: Option<String>,
    slider_value: Option<u32>,
    text: Option<String>,
) -> Result<(), String> {
    let mut demo = state.state.write().await;

    if let Some(v) = counter {
        demo.counter = v;
    }
    if let Some(v) = color {
        demo.color = v;
    }
    if let Some(v) = slider_value {
        demo.slider_value = v.min(100);
    }
    if let Some(v) = text {
        demo.text = v;
    }

    // Bump revision
    let mut rev = state.revision.write().await;
    *rev = rev.saturating_add(1);
    let revision = rev.to_string();

    // Оповещаем все окна об изменении
    let _ = app_handle.emit(
        EVENT_STATE_SYNC_INVALIDATION,
        StateSyncInvalidationPayload {
            topic: "demo".to_string(),
            revision,
            source_id: None,
            timestamp_ms: chrono::Utc::now().timestamp_millis(),
        },
    );

    Ok(())
}

// --- Открытие demo окон ---

pub fn open_demo_windows(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    use tauri::WebviewUrl;
    use tauri::WebviewWindowBuilder;

    let window_width: f64 = 420.0;
    let window_height: f64 = 680.0;
    let gap: f64 = 20.0;

    // Определяем позицию по центру экрана — три окна в ряд
    let (center_x, center_y) = if let Some(monitor) = app.primary_monitor()? {
        let size = monitor.size();
        let position = monitor.position();
        (
            position.x as f64 + (size.width as f64 / 2.0),
            position.y as f64 + (size.height as f64 / 2.0),
        )
    } else {
        (960.0, 540.0)
    };

    let total_width = window_width * 3.0 + gap * 2.0;
    let start_x = center_x - total_width / 2.0;
    let top_y = center_y - window_height / 2.0;

    let labels = ["demo-a", "demo-b", "demo-c"];
    let titles = [
        "State-Sync Demo — Window A",
        "State-Sync Demo — Window B",
        "State-Sync Demo — Window C",
    ];

    for (i, (label, title)) in labels.iter().zip(titles.iter()).enumerate() {
        let x = start_x + (window_width + gap) * i as f64;
        WebviewWindowBuilder::new(app, *label, WebviewUrl::App("demo.html".into()))
            .title(*title)
            .inner_size(window_width, window_height)
            .position(x, top_y)
            .resizable(false)
            .decorations(true)
            .visible(true)
            .build()?;
    }

    log::info!("Demo windows opened: demo-a, demo-b, demo-c");
    Ok(())
}
