var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base", "@syncfusion/ej2-base", "@syncfusion/ej2-base", "@syncfusion/ej2-base", "@syncfusion/ej2-layouts", "@syncfusion/ej2-popups", "../pop-up/dialog", "../models/index", "../models/index", "../layout/large-icons-view", "@syncfusion/ej2-inputs", "../models/upload-settings", "./constant", "./classes", "../common/operations", "../common/utility", "../common/utility", "../models/contextMenu-settings", "../actions/breadcrumb-bar", "../pop-up/context-menu", "../models/default-locale"], function (require, exports, ej2_base_1, ej2_base_2, ej2_base_3, ej2_base_4, ej2_base_5, ej2_layouts_1, ej2_popups_1, dialog_1, index_1, index_2, large_icons_view_1, ej2_inputs_1, upload_settings_1, events, CLS, operations_1, utility_1, utility_2, contextMenu_settings_1, breadcrumb_bar_1, context_menu_1, default_locale_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The FileManager component allows users to access and manage the file system through the web  browser. It can performs the
     * functionalities like add, rename, search, sort, upload and delete files or folders. And also it
     * provides an easy way of  dynamic injectable modules like toolbar, navigationpane, detailsview, largeiconsview.
     * ```html
     *  <div id="file"></div>
     * ```
     * ```typescript,
     *  let feObj: FileManager = new FileManager();
     *  feObj.appendTo('#file');
     * ```
     */
    var FileManager = /** @class */ (function (_super) {
        __extends(FileManager, _super);
        function FileManager(options, element) {
            var _this = _super.call(this, options, element) || this;
            // eslint-disable-next-line
            _this.filterData = null;
            _this.selectedNodes = [];
            _this.duplicateItems = [];
            // eslint-disable-next-line
            _this.duplicateRecords = [];
            _this.previousPath = [];
            _this.nextPath = [];
            _this.isLayoutChange = false;
            _this.layoutSelectedItems = [];
            _this.renamedId = null;
            _this.uploadItem = [];
            _this.deleteRecords = [];
            _this.isFile = false;
            _this.isCut = false;
            _this.isSearchCut = false;
            _this.isSearchDrag = false;
            _this.isPasteError = false;
            _this.folderPath = '';
            _this.isSameAction = false;
            _this.isFiltered = false;
            // Specifies whether the sort by option is clicked or not.
            _this.isSortByClicked = false;
            _this.enablePaste = false;
            _this.persistData = false;
            _this.retryArgs = [];
            _this.isOpened = false;
            _this.isRetryOpened = false;
            _this.isPathDrag = false;
            // eslint-disable-next-line
            _this.searchedItems = [];
            _this.retryFiles = [];
            _this.isApplySame = false;
            // eslint-disable-next-line
            _this.dragData = [];
            _this.dragNodes = [];
            _this.dragPath = '';
            _this.dropPath = '';
            _this.isDragDrop = false;
            _this.treeExpandTimer = null;
            _this.dragCursorPosition = { left: 44, top: 18 };
            _this.isDropEnd = false;
            _this.dragCount = 0;
            // eslint-disable-next-line
            _this.droppedObjects = [];
            _this.uploadingCount = 0;
            _this.uploadedCount = 0;
            FileManager_1.Inject(breadcrumb_bar_1.BreadCrumbBar, large_icons_view_1.LargeIconsView, context_menu_1.ContextMenu);
            return _this;
        }
        FileManager_1 = FileManager;
        /**
         * Get component name.
         *
         * @returns {string} - returns module name.
         * @private
         */
        FileManager.prototype.getModuleName = function () {
            return 'filemanager';
        };
        /**
         * Initialize the event handler
         *
         * @returns {void}
         */
        FileManager.prototype.preRender = function () {
            if (ej2_base_4.isNullOrUndefined(this.element.id) || this.element.id === '') {
                this.element.setAttribute('id', ej2_base_3.getUniqueID('filemanager'));
            }
            this.ensurePath();
            this.feParent = [];
            this.feFiles = [];
            ej2_base_3.setStyleAttribute(this.element, { 'width': ej2_base_4.formatUnit(this.width), 'height': ej2_base_4.formatUnit(this.height) });
            this.isDevice = ej2_base_4.Browser.isDevice;
            this.isMobile = this.checkMobile();
            if (this.isMobile) {
                this.setProperties({ navigationPaneSettings: { visible: false } }, true);
            }
            var ele = ej2_base_1.closest(this.element, '.e-bigger');
            this.isBigger = ele ? true : false;
            this.activeModule = (this.view === 'LargeIcons') ? 'largeiconsview' : 'detailsview';
            ej2_popups_1.createSpinner({ target: this.element }, ej2_base_3.createElement);
            this.addWrapper();
            this.keyConfigs = {
                altN: 'alt+n',
                f5: 'f5',
                ctrlShift1: 'ctrl+shift+1',
                ctrlShift2: 'ctrl+shift+2',
                ctrlU: 'ctrl+u'
            };
            this.localeObj = new ej2_base_1.L10n(this.getModuleName(), default_locale_1.defaultLocale, this.locale);
        };
        /**
         * Gets the properties to be maintained upon browser refresh.
         *
         * @returns {string} - returns the persisted data.
         * @hidden
         */
        FileManager.prototype.getPersistData = function () {
            var keyEntity = ['view', 'path', 'selectedItems'];
            return this.addOnPersist(keyEntity);
        };
        /**
         * To provide the array of modules needed for component rendering
         *
         * @returns {ModuleDeclaration[]} - returns module declaration.
         * @hidden
         */
        FileManager.prototype.requiredModules = function () {
            var modules = [];
            modules.push({
                member: 'breadcrumbbar',
                args: [this]
            });
            modules.push({
                member: 'largeiconsview',
                args: [this]
            });
            if (this.toolbarSettings.visible) {
                modules.push({
                    member: 'toolbar',
                    args: [this]
                });
            }
            if (this.navigationPaneSettings.visible) {
                modules.push({
                    member: 'navigationpane',
                    args: [this]
                });
            }
            if (this.view) {
                modules.push({
                    member: 'detailsview',
                    args: [this]
                });
            }
            if (this.contextMenuSettings.visible && !this.isDevice) {
                modules.push({
                    member: 'contextmenu',
                    args: [this]
                });
            }
            return modules;
        };
        /**
         * To Initialize the control rendering
         *
         * @private
         * @returns {void}
         */
        FileManager.prototype.render = function () {
            this.initialize();
            var slItems = ej2_base_4.isNullOrUndefined(this.selectedItems) ? [] :
                this.allowMultiSelection ? this.selectedItems : this.selectedItems.slice(this.selectedItems.length - 1);
            this.setProperties({ selectedItems: slItems }, true);
            this.fileView = this.view;
            this.setRtl(this.enableRtl);
            this.addEventListeners();
            operations_1.read(this, (this.path !== this.originalPath) ? events.initialEnd : events.finalizeEnd, this.path);
            this.adjustHeight();
            if (ej2_base_4.isNullOrUndefined(this.navigationpaneModule)) {
                this.splitterObj.collapse(this.enableRtl ? 1 : 0);
                var bar = ej2_base_2.select('.' + CLS.SPLIT_BAR, this.element);
                bar.classList.add(CLS.DISPLAY_NONE);
            }
            this.wireEvents();
            this.renderComplete();
        };
        FileManager.prototype.ensurePath = function () {
            var currentPath = this.path;
            if (ej2_base_4.isNullOrUndefined(currentPath)) {
                currentPath = '/';
            }
            if (currentPath.lastIndexOf('/') !== (currentPath.length - 1)) {
                currentPath = currentPath + '/';
            }
            this.originalPath = currentPath;
            var paths = currentPath.split('/');
            this.setProperties({ path: paths[0] + '/' }, true);
            this.pathNames = [];
            this.pathId = ['fe_tree'];
            this.itemData = [];
        };
        FileManager.prototype.initialize = function () {
            if (this.isMobile) {
                ej2_base_3.addClass([this.element], CLS.MOBILE);
            }
            if (this.allowMultiSelection) {
                ej2_base_3.addClass([this.element], CLS.CHECK_SELECT);
            }
            this.addCssClass(null, this.cssClass);
            this.renderFileUpload();
        };
        FileManager.prototype.addWrapper = function () {
            var headerWrap = this.createElement('div', { id: this.element.id + CLS.TOOLBAR_ID });
            this.element.appendChild(headerWrap);
            var layoutWrap = this.createElement('div', {
                id: this.element.id + CLS.LAYOUT_ID, className: CLS.LAYOUT
            });
            this.element.appendChild(layoutWrap);
            var navigationWrap = this.createElement('div', {
                id: this.element.id + CLS.NAVIGATION_ID, className: CLS.NAVIGATION
            });
            var treeWrap = this.createElement('div', {
                id: this.element.id + CLS.TREE_ID
            });
            navigationWrap.appendChild(treeWrap);
            var contentWrap = this.createElement('div', {
                id: this.element.id + CLS.CONTENT_ID, className: CLS.LAYOUT_CONTENT
            });
            this.breadCrumbBarNavigation = this.createElement('div', {
                id: this.element.id + CLS.BREADCRUMBBAR_ID,
                className: CLS.BREADCRUMBS
            });
            contentWrap.appendChild(this.breadCrumbBarNavigation);
            var gridWrap = this.createElement('div', {
                id: this.element.id + CLS.GRID_ID
            });
            contentWrap.appendChild(gridWrap);
            var largeiconWrap = this.createElement('div', {
                id: this.element.id + CLS.LARGEICON_ID,
                className: CLS.LARGE_ICONS, attrs: { 'role': 'group' }
            });
            contentWrap.appendChild(largeiconWrap);
            var overlay = this.createElement('span', { className: CLS.OVERLAY });
            contentWrap.appendChild(overlay);
            var paneSettings;
            if (!this.enableRtl) {
                layoutWrap.appendChild(navigationWrap);
                layoutWrap.appendChild(contentWrap);
                paneSettings = [
                    {
                        size: '25%', min: this.navigationPaneSettings.minWidth.toString(),
                        max: this.navigationPaneSettings.maxWidth.toString()
                    },
                    { size: '75%', min: '270px' }
                ];
            }
            else {
                layoutWrap.appendChild(contentWrap);
                layoutWrap.appendChild(navigationWrap);
                paneSettings = [
                    { size: '75%', min: '270px' },
                    {
                        size: '25%', min: this.navigationPaneSettings.minWidth.toString(),
                        max: this.navigationPaneSettings.maxWidth.toString()
                    }
                ];
            }
            this.splitterObj = new ej2_layouts_1.Splitter({
                paneSettings: paneSettings,
                width: '100%',
                enableRtl: false,
                enableHtmlSanitizer: this.enableHtmlSanitizer,
                resizing: this.splitterResize.bind(this)
            });
            this.splitterObj.isStringTemplate = true;
            this.splitterObj.appendTo(layoutWrap);
            var dialogWrap = this.createElement('div', { id: this.element.id + CLS.DIALOG_ID });
            this.element.appendChild(dialogWrap);
            var menuWrap = this.createElement('ul', { id: this.element.id + CLS.CONTEXT_MENU_ID });
            this.element.appendChild(menuWrap);
            var dialogImgWrap = this.createElement('div', { id: this.element.id + CLS.IMG_DIALOG_ID });
            this.element.appendChild(dialogImgWrap);
            var extnDialogWrap = this.createElement('div', { id: this.element.id + CLS.EXTN_DIALOG_ID });
            this.element.appendChild(extnDialogWrap);
            var uploadDialogWrap = this.createElement('div', { id: this.element.id + CLS.UPLOAD_DIALOG_ID });
            this.element.appendChild(uploadDialogWrap);
        };
        FileManager.prototype.adjustHeight = function () {
            var toolbar = ej2_base_2.select('#' + this.element.id + CLS.TOOLBAR_ID, this.element);
            var toolBarHeight = toolbar ? toolbar.offsetHeight : 0;
            if (this.splitterObj) {
                this.splitterObj.height = (this.element.clientHeight - toolBarHeight).toString();
                this.splitterObj.dataBind();
            }
        };
        /* istanbul ignore next */
        FileManager.prototype.splitterResize = function () {
            this.notify(events.splitterResize, {});
        };
        FileManager.prototype.splitterAdjust = function () {
            var bar = ej2_base_2.select('.' + CLS.SPLIT_BAR, this.element);
            if (this.navigationPaneSettings.visible) {
                this.splitterObj.expand(this.enableRtl ? 1 : 0);
                bar.classList.remove(CLS.DISPLAY_NONE);
            }
            else {
                this.splitterObj.collapse(this.enableRtl ? 1 : 0);
                bar.classList.add(CLS.DISPLAY_NONE);
            }
        };
        FileManager.prototype.addCssClass = function (oldOne, newOne) {
            if (!ej2_base_4.isNullOrUndefined(oldOne) && oldOne !== '') {
                ej2_base_3.removeClass([this.element], oldOne.split(' '));
            }
            if (!ej2_base_4.isNullOrUndefined(newOne) && newOne !== '') {
                ej2_base_3.addClass([this.element], newOne.split(' '));
            }
        };
        FileManager.prototype.showSpinner = function () {
            ej2_popups_1.showSpinner(this.element);
        };
        FileManager.prototype.hideSpinner = function () {
            ej2_popups_1.hideSpinner(this.element);
        };
        FileManager.prototype.onContextMenu = function (e) {
            e.preventDefault();
        };
        FileManager.prototype.checkMobile = function () {
            return (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ej2_base_4.Browser.userAgent.toLowerCase())
                && /mobile/i.test(ej2_base_4.Browser.userAgent.toLowerCase()));
        };
        FileManager.prototype.renderFileUpload = function () {
            var id = this.element.id + CLS.UPLOAD_ID;
            var uploadEle = this.createElement('input', { id: id, attrs: { name: 'uploadFiles', type: 'file' } });
            this.element.appendChild(uploadEle);
            this.uploadDialogObj = new ej2_popups_1.Dialog({
                header: utility_1.getLocaleText(this, 'Header-Upload'),
                content: uploadEle,
                animationSettings: { effect: 'None' },
                showCloseIcon: true,
                closeOnEscape: true,
                visible: false,
                isModal: true,
                width: '350px',
                target: this.popupTarget ? this.popupTarget : '#' + this.element.id,
                cssClass: utility_1.getCssClass(this, this.isMobile ? CLS.MOB_POPUP : CLS.ROOT_POPUP),
                locale: this.locale,
                allowDragging: true,
                position: { X: 'center', Y: 'center' },
                enableRtl: this.enableRtl,
                enableHtmlSanitizer: this.enableHtmlSanitizer,
                open: this.onOpen.bind(this),
                close: this.onClose.bind(this),
                beforeOpen: this.onBeforeOpen.bind(this),
                beforeClose: this.onBeforeClose.bind(this)
            });
            this.uploadDialogObj.appendTo('#' + this.element.id + CLS.UPLOAD_DIALOG_ID);
            this.renderUploadBox();
        };
        FileManager.prototype.renderUploadBox = function () {
            var uploadUrl = this.ajaxSettings.uploadUrl ? this.ajaxSettings.uploadUrl : this.ajaxSettings.url;
            this.uploadObj = new ej2_inputs_1.Uploader({
                dropArea: ej2_base_2.select('#' + this.element.id + CLS.CONTENT_ID, this.element),
                asyncSettings: {
                    saveUrl: uploadUrl,
                    removeUrl: uploadUrl
                },
                locale: this.locale,
                enableRtl: this.enableRtl,
                uploading: this.onUploading.bind(this),
                removing: this.onRemoving.bind(this),
                canceling: this.onCancel.bind(this),
                clearing: this.onClearing.bind(this),
                selected: this.onSelected.bind(this),
                success: this.onUploadSuccess.bind(this),
                failure: this.onUploadFailure.bind(this),
                autoUpload: this.uploadSettings.autoUpload,
                minFileSize: this.uploadSettings.minFileSize,
                maxFileSize: this.uploadSettings.maxFileSize,
                allowedExtensions: this.uploadSettings.allowedExtensions,
                fileListRendering: this.onFileListRender.bind(this)
            });
            this.uploadObj.appendTo('#' + this.element.id + CLS.UPLOAD_ID);
        };
        FileManager.prototype.onFileListRender = function (args) {
            this.trigger('uploadListCreate', args);
        };
        FileManager.prototype.updateUploader = function () {
            this.uploadObj.autoUpload = this.uploadSettings.autoUpload;
            this.uploadObj.minFileSize = this.uploadSettings.minFileSize;
            this.uploadObj.maxFileSize = this.uploadSettings.maxFileSize;
            this.uploadObj.allowedExtensions = this.uploadSettings.allowedExtensions;
            this.uploadObj.dataBind();
        };
        FileManager.prototype.onBeforeOpen = function (args) {
            var eventArgs = {
                cancel: args.cancel, popupName: 'Upload', popupModule: this.uploadDialogObj
            };
            this.trigger('beforePopupOpen', eventArgs, function (eventargs) {
                args.cancel = eventargs.cancel;
            });
        };
        FileManager.prototype.onBeforeClose = function (args) {
            var eventArgs = {
                cancel: args.cancel, popupName: 'Upload', popupModule: this.uploadDialogObj
            };
            this.trigger('beforePopupClose', eventArgs, function (eventargs) {
                args.cancel = eventargs.cancel;
            });
        };
        FileManager.prototype.onOpen = function () {
            this.isOpened = true;
            this.uploadDialogObj.element.focus();
            var args = {
                popupModule: this.uploadDialogObj, popupName: 'Upload',
                element: this.uploadDialogObj.element
            };
            this.trigger('popupOpen', args);
        };
        FileManager.prototype.onClose = function () {
            this.isOpened = false;
            this.uploadObj.clearAll();
            var args = {
                popupModule: this.uploadDialogObj, popupName: 'Upload',
                element: this.uploadDialogObj.element
            };
            this.trigger('popupClose', args);
        };
        /* istanbul ignore next */
        FileManager.prototype.onUploading = function (args) {
            var action = 'save';
            if ((this.retryArgs.length !== 0)) {
                for (var i = 0; i < this.retryArgs.length; i++) {
                    if (args.fileData.name === this.retryArgs[i].file.name) {
                        action = this.retryArgs[i].action;
                        this.retryArgs.splice(i, 1);
                        i = this.retryArgs.length;
                    }
                }
            }
            var data = JSON.stringify(ej2_base_5.getValue(this.pathId[this.pathId.length - 1], this.feParent));
            args.customFormData = [{ 'path': this.path }, { 'action': action }, { 'data': data }];
            var uploadUrl = this.ajaxSettings.uploadUrl ? this.ajaxSettings.uploadUrl : this.ajaxSettings.url;
            // eslint-disable-next-line
            var ajaxSettings = {
                url: uploadUrl,
                type: 'POST',
                mode: true,
                dataType: null,
                contentType: null,
                data: JSON.stringify(args.customFormData),
                onSuccess: null,
                onFailure: null,
                beforeSend: null
            };
            this.uploadEventArgs = { action: 'Upload', ajaxSettings: ajaxSettings, cancel: false };
            this.trigger('beforeSend', this.uploadEventArgs, function (uploadEventArgs) {
                args.customFormData = JSON.parse(ej2_base_5.getValue('data', uploadEventArgs.ajaxSettings));
                args.cancel = uploadEventArgs.cancel;
                // eslint-disable-next-line
                var eventArgs = {
                    cancel: false,
                    httpRequest: args.currentRequest
                };
                if (typeof ej2_base_5.getValue('beforeSend', uploadEventArgs.ajaxSettings) === 'function') {
                    ej2_base_5.getValue('beforeSend', uploadEventArgs.ajaxSettings)(eventArgs);
                    if (ej2_base_5.getValue('cancel', eventArgs)) {
                        args.cancel = ej2_base_5.getValue('cancel', eventArgs);
                    }
                }
            });
        };
        FileManager.prototype.onRemoving = function () {
            this.onFileUploadSuccess({ count: 1 });
            if (this.uploadObj.getFilesData().length === 1) {
                this.uploadDialogObj.hide();
            }
        };
        /* istanbul ignore next */
        FileManager.prototype.onCancel = function (args) {
            var data = JSON.stringify(ej2_base_5.getValue(this.pathId[this.pathId.length - 1], this.feParent));
            args.customFormData = [{ 'path': this.path }, { 'action': 'remove' }, { 'data': data }];
        };
        /* istanbul ignore next */
        FileManager.prototype.onClearing = function () {
            if (this.isOpened) {
                this.uploadDialogObj.hide();
            }
        };
        /* istanbul ignore next */
        FileManager.prototype.onSelected = function (args) {
            if (args.filesData.length === 0) {
                return;
            }
            this.uploadingCount = args.filesData.length;
            this.uploadedCount = 0;
            // eslint-disable-next-line
            var details = utility_1.getPathObject(this);
            if (!utility_2.hasUploadAccess(details)) {
                args.cancel = true;
                utility_1.createDeniedDialog(this, details, events.permissionUpload);
                return;
            }
            this.uploadDialogObj.show();
        };
        // eslint-disable-next-line
        FileManager.prototype.onFileUploadSuccess = function (args) {
            this.uploadedCount = this.uploadedCount + args.count;
            if (this.uploadSettings.autoClose && (this.uploadingCount === this.uploadedCount)) {
                this.uploadDialogObj.hide();
            }
        };
        /* istanbul ignore next */
        // eslint-disable-next-line
        FileManager.prototype.onUploadSuccess = function (files) {
            var args = { action: 'Upload', result: files };
            this.trigger('success', args);
            this.itemData = [ej2_base_5.getValue(this.pathId[this.pathId.length - 1], this.feParent)];
            operations_1.read(this, events.pathChanged, this.path);
            this.onFileUploadSuccess({ count: 1 });
            if (typeof ej2_base_5.getValue('onSuccess', this.uploadEventArgs.ajaxSettings) === 'function') {
                ej2_base_5.getValue('onSuccess', this.uploadEventArgs.ajaxSettings)();
            }
        };
        /* istanbul ignore next */
        // eslint-disable-next-line
        FileManager.prototype.onUploadFailure = function (files) {
            // eslint-disable-next-line
            var response = ej2_base_5.getValue('response', files);
            var statusText = ej2_base_5.getValue('statusText', response);
            if (statusText !== '') {
                ej2_base_5.setValue('statusText', statusText, files);
            }
            var args = { action: 'Upload', error: files };
            this.trigger('failure', args);
            if (ej2_base_5.getValue('statusCode', response) === 400) {
                this.retryFiles.push(ej2_base_5.getValue('file', files));
                if (!this.isRetryOpened) {
                    dialog_1.createExtDialog(this, 'UploadRetry');
                }
            }
            if (typeof ej2_base_5.getValue('onFailure', this.uploadEventArgs.ajaxSettings) === 'function') {
                ej2_base_5.getValue('onFailure', this.uploadEventArgs.ajaxSettings)();
            }
        };
        FileManager.prototype.onInitialEnd = function () {
            utility_1.setNextPath(this, this.path);
        };
        FileManager.prototype.addEventListeners = function () {
            this.on(events.beforeRequest, this.showSpinner, this);
            this.on(events.afterRequest, this.hideSpinner, this);
            this.on(events.initialEnd, this.onInitialEnd, this);
            this.on(events.detailsInit, this.onDetailsInit, this);
            this.on(events.skipUpload, this.onFileUploadSuccess, this);
            ej2_base_5.EventHandler.add(this.element, 'contextmenu', this.onContextMenu, this);
        };
        FileManager.prototype.removeEventListeners = function () {
            if (this.isDestroyed) {
                return;
            }
            this.off(events.beforeRequest, this.showSpinner);
            this.off(events.afterRequest, this.hideSpinner);
            this.off(events.initialEnd, this.onInitialEnd);
            this.off(events.detailsInit, this.onDetailsInit);
            this.off(events.skipUpload, this.onFileUploadSuccess);
            ej2_base_5.EventHandler.remove(this.element, 'contextmenu', this.onContextMenu);
        };
        FileManager.prototype.onDetailsInit = function () {
            if (ej2_base_4.isNullOrUndefined(this.activeModule)) {
                this.itemData = [ej2_base_5.getValue(this.pathId[this.pathId.length - 1], this.feParent)];
            }
        };
        FileManager.prototype.resizeHandler = function () {
            this.adjustHeight();
            this.notify(events.resizeEnd, {});
        };
        FileManager.prototype.keyActionHandler = function (e) {
            var uploadEle;
            switch (e.action) {
                case 'altN':
                    e.preventDefault();
                    this.itemData = [utility_1.getPathObject(this)];
                    if (!utility_2.hasContentAccess(this.itemData[0])) {
                        utility_1.createDeniedDialog(this, this.itemData[0], events.permissionEditContents);
                    }
                    else {
                        dialog_1.createDialog(this, 'NewFolder');
                    }
                    break;
                case 'f5':
                    e.preventDefault();
                    utility_1.refresh(this);
                    break;
                /* istanbul ignore next */
                case 'ctrlShift1':
                    e.preventDefault();
                    this.fileView = 'Details';
                    this.setProperties({ view: 'Details' }, true);
                    ej2_popups_1.showSpinner(this.element);
                    utility_2.updateLayout(this, 'Details');
                    break;
                /* istanbul ignore next */
                case 'ctrlShift2':
                    e.preventDefault();
                    this.fileView = 'LargeIcons';
                    this.setProperties({ view: 'LargeIcons' }, true);
                    ej2_popups_1.showSpinner(this.element);
                    utility_2.updateLayout(this, 'LargeIcons');
                    break;
                case 'ctrlU':
                    e.preventDefault();
                    uploadEle = ej2_base_2.select('#' + this.element.id + CLS.UPLOAD_ID, this.element);
                    uploadEle.click();
                    break;
            }
        };
        FileManager.prototype.wireEvents = function () {
            ej2_base_5.EventHandler.add(window, 'resize', this.resizeHandler, this);
            this.keyboardModule = new ej2_base_4.KeyboardEvents(this.element, {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
        };
        FileManager.prototype.unWireEvents = function () {
            ej2_base_5.EventHandler.remove(window, 'resize', this.resizeHandler);
            this.keyboardModule.destroy();
        };
        FileManager.prototype.setPath = function () {
            this.setProperties({ selectedItems: [] }, true);
            this.ensurePath();
            this.notify(events.clearPathInit, { selectedNode: this.pathId[0] });
            operations_1.read(this, (this.path !== this.originalPath) ? events.initialEnd : events.finalizeEnd, this.path);
        };
        /**
         * Called internally if any of the property value changed.
         *
         * @param  {FileManager} newProp
         * @param  {FileManager} oldProp
         * @returns void
         * @private
         */
        /* istanbul ignore next */
        // eslint:disable-next-line
        FileManager.prototype.onPropertyChanged = function (newProp, oldProp) {
            var height;
            for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'ajaxSettings':
                        this.ajaxSettingSetModel(newProp);
                        break;
                    case 'allowDragAndDrop':
                        this.allowDragAndDrop = newProp.allowDragAndDrop;
                        this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                        break;
                    case 'allowMultiSelection':
                        if (this.allowMultiSelection) {
                            ej2_base_3.addClass([this.element], CLS.CHECK_SELECT);
                        }
                        else {
                            if (this.selectedItems.length > 1) {
                                this.setProperties({ selectedItems: this.selectedItems.slice(this.selectedItems.length - 1) }, true);
                            }
                            ej2_base_3.removeClass([this.element], CLS.CHECK_SELECT);
                        }
                        this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                        break;
                    case 'cssClass':
                        this.addCssClass(oldProp.cssClass, newProp.cssClass);
                        this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                        break;
                    case 'detailsViewSettings':
                        this.notify(events.modelChanged, { module: 'detailsview', newProp: newProp, oldProp: oldProp });
                        break;
                    case 'enableRtl':
                        this.enableRtl = newProp.enableRtl;
                        this.refresh();
                        break;
                    case 'rootAliasName':
                        this.rootAliasName = newProp.rootAliasName;
                        this.refresh();
                        break;
                    case 'height':
                        height = !ej2_base_4.isNullOrUndefined(newProp.height) ? ej2_base_4.formatUnit(newProp.height) : newProp.height;
                        ej2_base_3.setStyleAttribute(this.element, { 'height': height });
                        this.adjustHeight();
                        this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                        break;
                    case 'locale':
                        if (!ej2_base_4.isNullOrUndefined(newProp.enableRtl)) {
                            this.setProperties({ enableRtl: newProp.enableRtl }, true);
                        }
                        this.localeSetModelOption(newProp);
                        break;
                    case 'navigationPaneSettings':
                        this.splitterAdjust();
                        this.notify(events.modelChanged, { module: 'navigationpane', newProp: newProp, oldProp: oldProp });
                        break;
                    case 'path':
                        this.setPath();
                        break;
                    case 'searchSettings':
                        if (!ej2_base_1.isNullOrUndefined(newProp.searchSettings.allowSearchOnTyping)) {
                            this.setProperties({ searchSettings: { allowSearchOnTyping: newProp.searchSettings.allowSearchOnTyping } }, true);
                        }
                        if (ej2_base_1.isNullOrUndefined(newProp.searchSettings.ignoreCase)) {
                            this.setProperties({ searchSettings: { ignoreCase: newProp.searchSettings.ignoreCase } }, true);
                        }
                        if (ej2_base_1.isNullOrUndefined(newProp.searchSettings.filterType)) {
                            this.setProperties({ searchSettings: { filterType: newProp.searchSettings.filterType } }, true);
                        }
                        this.notify(events.modelChanged, { module: 'breadcrumbbar', newProp: newProp, oldProp: oldProp });
                        break;
                    case 'selectedItems':
                        if (this.view === 'Details') {
                            this.notify(events.modelChanged, { module: 'detailsview', newProp: newProp, oldProp: oldProp });
                        }
                        else if (this.view === 'LargeIcons') {
                            this.notify(events.modelChanged, { module: 'largeiconsview', newProp: newProp, oldProp: oldProp });
                        }
                        break;
                    case 'showFileExtension':
                        this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                        break;
                    case 'showHiddenItems':
                        this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                        break;
                    case 'showThumbnail':
                        this.notify(events.modelChanged, { module: 'largeiconsview', newProp: newProp, oldProp: oldProp });
                        break;
                    case 'toolbarSettings':
                        this.adjustHeight();
                        this.notify(events.modelChanged, { module: 'toolbar', newProp: newProp, oldProp: oldProp });
                        break;
                    case 'uploadSettings':
                        this.updateUploader();
                        break;
                    case 'view':
                        if (newProp.view === 'Details') {
                            this.notify(events.modelChanged, { module: 'detailsview', newProp: newProp, oldProp: oldProp });
                        }
                        else if (newProp.view === 'LargeIcons') {
                            this.notify(events.modelChanged, { module: 'largeiconsview', newProp: newProp, oldProp: oldProp });
                        }
                        break;
                    case 'width':
                        ej2_base_3.setStyleAttribute(this.element, { 'width': !ej2_base_4.isNullOrUndefined(newProp.width) ? ej2_base_4.formatUnit(newProp.width) : newProp.width });
                        this.notify(events.modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                        break;
                    case 'sortOrder':
                        utility_1.refresh(this);
                        this.notify(events.sortByChange, {});
                        break;
                    case 'sortBy':
                        utility_1.refresh(this);
                        this.notify(events.sortByChange, {});
                        if (this.view === 'Details') {
                            this.notify(events.sortColumn, {});
                        }
                        break;
                    case 'popupTarget':
                        if (this.uploadDialogObj) {
                            this.uploadDialogObj.target = newProp.popupTarget;
                        }
                        if (this.dialogObj) {
                            this.dialogObj.target = newProp.popupTarget;
                        }
                        if (this.extDialogObj) {
                            this.extDialogObj.target = newProp.popupTarget;
                        }
                        if (this.viewerObj) {
                            this.viewerObj.target = newProp.popupTarget;
                        }
                        break;
                }
            }
        };
        /* istanbul ignore next */
        FileManager.prototype.ajaxSettingSetModel = function (newProp) {
            if (!ej2_base_1.isNullOrUndefined(newProp.ajaxSettings.url)) {
                this.setProperties({ ajaxSettings: { url: newProp.ajaxSettings.url } }, true);
            }
            if (!ej2_base_1.isNullOrUndefined(newProp.ajaxSettings.uploadUrl)) {
                this.setProperties({ ajaxSettings: { uploadUrl: newProp.ajaxSettings.uploadUrl } }, true);
            }
            if (!ej2_base_1.isNullOrUndefined(newProp.ajaxSettings.downloadUrl)) {
                this.setProperties({ ajaxSettings: { downloadUrl: newProp.ajaxSettings.downloadUrl } }, true);
            }
            if (!ej2_base_1.isNullOrUndefined(newProp.ajaxSettings.getImageUrl)) {
                this.setProperties({ ajaxSettings: { getImageUrl: newProp.ajaxSettings.getImageUrl } }, true);
            }
            this.setProperties({ path: '/' }, true);
            this.setProperties({ selectedItems: [] }, true);
            _super.prototype.refresh.call(this);
        };
        /* istanbul ignore next */
        FileManager.prototype.localeSetModelOption = function (newProp) {
            this.uploadObj.locale = newProp.locale;
            _super.prototype.refresh.call(this);
        };
        /**
         * Triggers when the component is destroyed.
         *
         * @returns {void}
         */
        FileManager.prototype.destroy = function () {
            if (this.isDestroyed) {
                return;
            }
            if (!this.refreshing) {
                this.notify(events.destroy, {});
            }
            this.uploadObj.destroy();
            this.uploadObj = null;
            this.uploadDialogObj.destroy();
            this.uploadDialogObj = null;
            this.splitterObj.destroy();
            this.splitterObj = null;
            if (this.dialogObj) {
                this.dialogObj.destroy();
                this.dialogObj = null;
            }
            if (this.viewerObj) {
                this.viewerObj.destroy();
                this.viewerObj = null;
            }
            if (this.extDialogObj) {
                this.extDialogObj.destroy();
                this.extDialogObj = null;
            }
            this.element.removeAttribute('style');
            this.element.removeAttribute('tabindex');
            this.removeEventListeners();
            this.unWireEvents();
            this.addCssClass(this.cssClass, null);
            ej2_base_3.removeClass([this.element], [CLS.RTL, CLS.MOBILE, CLS.CHECK_SELECT]);
            this.element.innerHTML = '';
            _super.prototype.destroy.call(this);
        };
        /**
         * Creates a new folder in file manager.
         *
         * @param {string} name – Specifies the name of new folder in current path.
         * If it is not specified, then the default new folder dialog will be opened.
         * @returns {void}
         */
        FileManager.prototype.createFolder = function (name) {
            this.notify(events.methodCall, { action: 'createFolder' });
            // eslint-disable-next-line
            var details = [utility_1.getPathObject(this)];
            this.itemData = details;
            if (name) {
                if (/[/\\|*?"<>:]/.test(name)) {
                    var result = {
                        files: null,
                        error: {
                            code: '402',
                            message: utility_1.getLocaleText(this, 'Validation-Invalid').replace('{0}', '"' + name + '"'),
                            fileExists: null
                        }
                    };
                    dialog_1.createDialog(this, 'Error', result);
                }
                else {
                    if (!utility_2.hasContentAccess(details[0])) {
                        utility_1.createDeniedDialog(this, details[0], events.permissionEditContents);
                    }
                    else {
                        operations_1.createFolder(this, name);
                    }
                }
            }
            else {
                utility_2.createNewFolder(this);
            }
        };
        /**
         * Deletes the folders or files from the given unique identifiers.
         *
         * @param {string} ids - Specifies the name of folders or files in current path. If you want to delete the nested level folders or
         * files, then specify the filter path along with name of the folders or files when performing the search or custom filtering.
         * For ID based file provider, specify the unique identifier of folders or files.
         * If it is not specified, then delete confirmation dialog will be opened for selected item.
         *
         * @returns {void}
         */
        FileManager.prototype.deleteFiles = function (ids) {
            this.notify(events.methodCall, { action: 'deleteFiles', ids: ids });
        };
        /**
         * Disables the specified toolbar items of the file manager.
         *
         * @param {string[]} items - Specifies an array of items to be disabled.
         * @returns {void}
         */
        FileManager.prototype.disableToolbarItems = function (items) {
            if (!ej2_base_4.isNullOrUndefined(items)) {
                this.toolbarModule.enableItems(items, false);
            }
        };
        /**
         * Downloads the folders or files from the given unique identifiers.
         *
         * @param {string} ids - Specifies the name of folders or files in current path. If you want to download the nested level folders
         * or files, then specify the filter path along with name of the folders or files when performing search or custom filtering.
         * For ID based file provider, specify the unique identifier of folders or files.
         * If it is not specified, then the selected items will be downloaded.
         *
         * @returns {void}
         */
        FileManager.prototype.downloadFiles = function (ids) {
            this.notify(events.methodCall, { action: 'downloadFiles', ids: ids });
        };
        /**
         * Enables the specified toolbar items of the file manager.
         *
         * @param {string[]} items - Specifies an array of items to be enabled.
         * @returns {void}
         */
        FileManager.prototype.enableToolbarItems = function (items) {
            if (!ej2_base_4.isNullOrUndefined(items)) {
                this.toolbarModule.enableItems(items, true);
            }
        };
        /**
         * Disables the specified context menu items in file manager. This method is used only in the menuOpen event.
         *
         * @param {string[]} items - Specifies an array of items to be disabled.
         * @returns {void}
         */
        FileManager.prototype.disableMenuItems = function (items) {
            if (!ej2_base_4.isNullOrUndefined(items) && !ej2_base_4.isNullOrUndefined(this.contextmenuModule.contextMenu)) {
                this.contextmenuModule.disableItem(items);
            }
        };
        /**
         * Returns the index position of given current context menu item in file manager.
         *
         * @param {string} item - Specifies an item to get the index position.
         * @returns {number} - returns menu item index.
         */
        FileManager.prototype.getMenuItemIndex = function (item) {
            if (this.contextmenuModule) {
                return this.contextmenuModule.getItemIndex(item);
            }
            else {
                return -1;
            }
        };
        /**
         * Returns the index position of given toolbar item in file manager.
         *
         * @param {string} item - Specifies an item to get the index position.
         * @returns {number} - returns toolbar item index.
         */
        FileManager.prototype.getToolbarItemIndex = function (item) {
            if (this.toolbarModule) {
                return this.toolbarModule.getItemIndex(item);
            }
            else {
                return -1;
            }
        };
        /**
         * Display the custom filtering files in file manager.
         *
         * @param {Object} filterData - Specifies the custom filter details along with custom file action name,
         * which needs to be sent to the server side. If you do not specify the details, then default action name will be `filter`.
         *
         * @returns {void}
         */
        // eslint-disable-next-line
        FileManager.prototype.filterFiles = function (filterData) {
            this.filterData = filterData ? filterData : null;
            this.setProperties({ selectedItems: [] }, true);
            this.notify(events.selectionChanged, {});
            this.isFiltered = true;
            if (this.breadcrumbbarModule.searchObj.element.value !== '') {
                this.breadcrumbbarModule.searchObj.element.value = '';
            }
            operations_1.filter(this, events.filterEnd);
        };
        /**
         * Gets the details of the selected files in the file manager.
         *
         * @returns {Object[]} - returns selected files.
         */
        // eslint-disable-next-line
        FileManager.prototype.getSelectedFiles = function () {
            this.notify(events.updateSelectionData, {});
            return this.itemData;
        };
        /**
         * Opens the corresponding file or folder from the given unique identifier.
         *
         * @param {string} id - Specifies the name of folder or file in current path. If you want to open the nested level folder or
         * file, then specify the filter path along with name of the folder or file when performing search or custom filtering. For ID based
         * file provider, specify the unique identifier of folder or file.
         *
         * @returns {void}
         */
        FileManager.prototype.openFile = function (id) {
            this.notify(events.methodCall, { action: 'openFile', id: id });
        };
        /**
         * Refreshes the folder files of the file manager.
         *
         * @returns {void}
         */
        FileManager.prototype.refreshFiles = function () {
            utility_1.refresh(this);
        };
        /**
         * Refreshes the layout of the file manager.
         *
         * @returns {void}
         */
        FileManager.prototype.refreshLayout = function () {
            this.adjustHeight();
            this.notify(events.layoutRefresh, {});
        };
        /**
         * Selects the entire folders and files in current path.
         *
         * @returns {void}
         */
        FileManager.prototype.selectAll = function () {
            this.notify(events.methodCall, { action: 'selectAll' });
        };
        /**
         * Deselects the currently selected folders and files in current path.
         *
         * @returns {void}
         */
        FileManager.prototype.clearSelection = function () {
            this.notify(events.methodCall, { action: 'clearSelection' });
        };
        /**
         * Renames the file or folder with given new name in file manager.
         *
         * @param {string} id - Specifies the name of folder or file in current path. If you want to rename the nested level folder or
         * file, then specify the filter path along with name of the folder or file when performing search or custom filtering. For ID based
         * file provider, specify the unique identifier of folder or file.
         * If it is not specified, then rename dialog will be opened for selected item.
         *
         * @param {string} name – Specifies the new name of the file or folder in current path. If it is not specified, then rename dialog
         * will be opened for given identifier.
         *
         * @returns {void}
         */
        FileManager.prototype.renameFile = function (id, name) {
            this.notify(events.methodCall, { action: 'renameFile', id: id, newName: name });
        };
        /**
         * Opens the upload dialog in file manager.
         *
         * @returns {void}
         */
        FileManager.prototype.uploadFiles = function () {
            // eslint-disable-next-line
            var details = [utility_1.getPathObject(this)];
            this.itemData = details;
            utility_2.uploadItem(this);
        };
        /**
         * Specifies the direction of FileManager
         *
         * @param {boolean} rtl - specifies rtl parameter.
         * @returns {void}
         */
        FileManager.prototype.setRtl = function (rtl) {
            if (rtl) {
                this.addCssClass(null, CLS.RTL);
            }
            else {
                this.addCssClass(CLS.RTL, null);
            }
            if (this.uploadObj) {
                this.uploadDialogObj.enableRtl = rtl;
                this.uploadObj.enableRtl = rtl;
            }
        };
        var FileManager_1;
        __decorate([
            ej2_base_2.Complex({}, index_1.AjaxSettings)
        ], FileManager.prototype, "ajaxSettings", void 0);
        __decorate([
            ej2_base_2.Property(false)
        ], FileManager.prototype, "allowDragAndDrop", void 0);
        __decorate([
            ej2_base_2.Property(true)
        ], FileManager.prototype, "allowMultiSelection", void 0);
        __decorate([
            ej2_base_2.Complex({}, contextMenu_settings_1.ContextMenuSettings)
        ], FileManager.prototype, "contextMenuSettings", void 0);
        __decorate([
            ej2_base_2.Property('')
        ], FileManager.prototype, "cssClass", void 0);
        __decorate([
            ej2_base_2.Complex({}, index_1.DetailsViewSettings)
        ], FileManager.prototype, "detailsViewSettings", void 0);
        __decorate([
            ej2_base_2.Property(true)
        ], FileManager.prototype, "enableHtmlSanitizer", void 0);
        __decorate([
            ej2_base_2.Property(false)
        ], FileManager.prototype, "enablePersistence", void 0);
        __decorate([
            ej2_base_2.Property('400px')
        ], FileManager.prototype, "height", void 0);
        __decorate([
            ej2_base_2.Property('LargeIcons')
        ], FileManager.prototype, "view", void 0);
        __decorate([
            ej2_base_2.Complex({}, index_1.NavigationPaneSettings)
        ], FileManager.prototype, "navigationPaneSettings", void 0);
        __decorate([
            ej2_base_2.Property('/')
        ], FileManager.prototype, "path", void 0);
        __decorate([
            ej2_base_2.Property(null)
        ], FileManager.prototype, "popupTarget", void 0);
        __decorate([
            ej2_base_2.Complex({}, index_2.SearchSettings)
        ], FileManager.prototype, "searchSettings", void 0);
        __decorate([
            ej2_base_2.Property()
        ], FileManager.prototype, "selectedItems", void 0);
        __decorate([
            ej2_base_2.Property(true)
        ], FileManager.prototype, "showFileExtension", void 0);
        __decorate([
            ej2_base_2.Property(null)
        ], FileManager.prototype, "rootAliasName", void 0);
        __decorate([
            ej2_base_2.Property(false)
        ], FileManager.prototype, "showHiddenItems", void 0);
        __decorate([
            ej2_base_2.Property(true)
        ], FileManager.prototype, "showThumbnail", void 0);
        __decorate([
            ej2_base_2.Property('Ascending')
        ], FileManager.prototype, "sortOrder", void 0);
        __decorate([
            ej2_base_2.Property('name')
        ], FileManager.prototype, "sortBy", void 0);
        __decorate([
            ej2_base_2.Complex({}, index_1.ToolbarSettings)
        ], FileManager.prototype, "toolbarSettings", void 0);
        __decorate([
            ej2_base_2.Complex({}, upload_settings_1.UploadSettings)
        ], FileManager.prototype, "uploadSettings", void 0);
        __decorate([
            ej2_base_2.Property('100%')
        ], FileManager.prototype, "width", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "fileLoad", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "fileOpen", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "beforeDownload", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "beforeImageLoad", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "beforePopupClose", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "beforePopupOpen", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "beforeSend", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "created", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "destroyed", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "fileDragStart", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "fileDragging", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "fileDragStop", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "fileDropped", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "fileSelection", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "fileSelect", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "menuClick", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "menuOpen", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "failure", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "popupClose", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "popupOpen", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "success", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "toolbarClick", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "toolbarCreate", void 0);
        __decorate([
            ej2_base_5.Event()
        ], FileManager.prototype, "uploadListCreate", void 0);
        FileManager = FileManager_1 = __decorate([
            ej2_base_2.NotifyPropertyChanges
        ], FileManager);
        return FileManager;
    }(ej2_base_1.Component));
    exports.FileManager = FileManager;
});
