'use strict';

const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = 'http://www.w3.org/1999/xlink';

export const template = {};

template.actionMenu = (cssModifier, actionSet) => {
  const actionMenu = template.element('div', 'action-menu', cssModifier, null, null);
  actionMenu.classList.add('hide');
  for (const btn of actionSet) {
    const element = template.btnIcon(btn.icon, btn.icon, null);
    actionMenu.appendChild(element);
  }
  return actionMenu;
};

template.btnBanner = (cssModifier, ariaLabel) => {
  const btnIcon = template.element('div', 'btn-banner', cssModifier, ariaLabel, null);
  return btnIcon;
};

template.btnIcon = (svgId, cssModifier, ariaLabel) => {
  const svgTag = document.createElementNS(svgNS, 'svg');
  svgTag.classList.add('icon-svg');
  const useTag = document.createElementNS(svgNS, 'use');
  useTag.setAttributeNS(xlinkNS, 'xlink:href', `icons.svg#${svgId}`);
  svgTag.appendChild(useTag);
  const btnIcon = template.element('div', 'btn-icon', cssModifier, ariaLabel, null);
  btnIcon.appendChild(svgTag);
  return btnIcon;
};

template.divDialog = (cssModifier, toolSet) => {
  const divDialog = template.element('div', 'dialog', cssModifier, null, null);
  const divDialogBtns = template.element('div', 'dialog-btns', cssModifier, null, null);
  for (const tool of toolSet) {
    let element;
    if (tool.type === 'btn') {
      element = template.element('div', 'btn-dialog', tool.cssModifier, tool.ariaLabel, tool.label);
      divDialogBtns.appendChild(element);
    } else if (tool.type === 'input') {
      element = template.input('dialog-input', cssModifier, tool.ariaLabel);
      divDialog.appendChild(element);
    } else if (tool.type === 'label') {
      element = template.element('div', 'dialog-label', cssModifier, null, null);
      if (tool.text) {
        element.textContent = tool.text;
      }
      divDialog.appendChild(element);
    } else if (tool.type === 'textarea') {
      element = template.element('textarea', 'dialog-textarea', cssModifier, tool.ariaLabel, null);
      divDialog.appendChild(element);
    }
  }
  divDialog.appendChild(divDialogBtns);
  return divDialog;
};

template.element = (tagName, cssBlock, cssModifier, ariaLabel, textContent) => {
  const element = document.createElement(tagName);
  element.classList.add(cssBlock);
  if (cssModifier) {
    element.classList.add(`${cssBlock}--${cssModifier}`);
  }
  if (ariaLabel) {
    element.setAttribute('aria-label', ariaLabel);
  }
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
};

template.input = (cssBlock, cssModifier, ariaLabel) => {
  const input = template.element('input', cssBlock, cssModifier, ariaLabel, null);
  input.setAttribute('type', 'text');
  return input;
};

template.page = (cssModifier) => {
  const page = template.element('div', 'page', cssModifier, null, null);
  page.classList.add('page--hide');
  return page;
};

template.scroll = (cssModifier) => {
  const scroll = template.element('div', 'scroll', cssModifier, null, null);
  return scroll;
};

template.toolbar = (cssModifier) => {
  const toolbar = template.element('div', 'toolbar', cssModifier, null, null);
  return toolbar;
};

template.toolbarLower = (toolSet) => {
  const toolbarLower = template.toolbar('lower');
  for (const tool of toolSet) {
    let element;
    if (tool.type === 'btn') {
      element = template.btnIcon(tool.icon, tool.icon, tool.ariaLabel);
      toolbarLower.appendChild(element);
    } else if (tool.type === 'input') {
      element = template.input('input', tool.modifier, tool.ariaLabel);
      toolbarLower.appendChild(element);
    }
  }
  return toolbarLower;
};

template.toolbarUpper = (toolSet) => {
  const toolbarUpper = template.toolbar('upper');
  for (const tool of toolSet) {
    let element;
    if (tool.type === 'btn') {
      element = template.btnIcon(tool.icon, tool.icon, tool.ariaLabel);
      toolbarUpper.appendChild(element);
    } else if (tool.type === 'btn-banner') {
      element = template.btnBanner(tool.cssModifier, tool.ariaLabel);
      toolbarUpper.appendChild(element);
    } else if (tool.type === 'banner') {
      element = template.element('div', 'banner', tool.cssModifier, null, tool.text);
      toolbarUpper.appendChild(element);
    }
  }
  return toolbarUpper;
};
