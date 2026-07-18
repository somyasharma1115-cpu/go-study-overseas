const WIDGET_BUTTON_SELECTOR = ".clustal-wa-button";
const WIDGET_PANEL_SELECTOR = ".clustal-wa-panel";

const findWidgetElements = () => {
  const button = document.querySelector<HTMLButtonElement>(WIDGET_BUTTON_SELECTOR);
  const panel = document.querySelector<HTMLElement>(WIDGET_PANEL_SELECTOR);

  return { button, panel };
};

export const openChatWidget = () => {
  const tryOpen = (attempt = 0) => {
    const { button, panel } = findWidgetElements();

    if (button && panel) {
      if (!panel.classList.contains("open")) {
        button.click();
      }

      return true;
    }

    if (attempt >= 10) {
      return false;
    }

    window.setTimeout(() => {
      tryOpen(attempt + 1);
    }, 150);

    return false;
  };

  return tryOpen();
};
