// src/utils/eventBus.js

class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event, listenerToRemove) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(
      (listener) => listener !== listenerToRemove
    );
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error(`Error handling event ${event}:`, err);
      }
    });
  }
}

export const eventBus = new EventBus();
export default eventBus;
