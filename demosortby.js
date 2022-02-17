define(["require", "exports", "./src/file-manager/base/file-manager", "./src/file-manager/layout/index", "./src/file-manager/actions/toolbar", "./node_modules/es6-promise/dist/es6-promise"], function (require, exports, file_manager_1, index_1, toolbar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    file_manager_1.FileManager.Inject(index_1.DetailsView, toolbar_1.Toolbar, index_1.NavigationPane);
    // let hostUrl: string = 'https://ng2jq.syncfusion.com/ej2services/';
    document.getElementById("change").onchange = function (args) {
        feObj.sortBy = args.target.value;
    };
    var hostUrl = 'https://ej2-aspcore-service.azurewebsites.net/';
    var feObj = new file_manager_1.FileManager({
        ajaxSettings: {
            url: hostUrl + 'api/FileManager/FileOperations',
            uploadUrl: hostUrl + 'api/FileManager/Upload',
            downloadUrl: hostUrl + 'api/FileManager/Download',
            getImageUrl: hostUrl + 'api/FileManager/GetImage'
        },
        sortBy: 'name',
        view: 'Details'
    });
    feObj.appendTo('#file');
});
