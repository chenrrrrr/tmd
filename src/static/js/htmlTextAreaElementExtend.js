HTMLTextAreaElement.prototype.getCaretPosition = function () {
  return this.selectionStart;
};
HTMLTextAreaElement.prototype.setCaretPosition = function (position) {
  this.selectionStart = position;
  this.selectionEnd = position;
  this.focus();
};
HTMLTextAreaElement.prototype.hasSelection = function () {
  if (this.selectionStart == this.selectionEnd) {
    return false;
  } else {
    return true;
  }
};
HTMLTextAreaElement.prototype.getSelectedText = function () {
  return this.value.substring(this.selectionStart, this.selectionEnd);
};
HTMLTextAreaElement.prototype.setSelection = function (start, end) {
  this.selectionStart = start;
  this.selectionEnd = end;
  this.focus();
};
HTMLTextAreaElement.prototype.setTabIndex = function (length) {
  var tabLength = "";
  for (var i = 0; i < length; i++) {
    tabLength += " "
  }
  return tabLength;
};