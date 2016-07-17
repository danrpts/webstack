Rule of thumb: Use a view's handler when there is a resource that needs to be looked up via the conceptual data hierarchy, otherwise, the view should be used directly (as there is nor resource needed or is readyily passed in via options). (The view class can be uses as a function because the constructor guards against 'new' keyword misuse)

