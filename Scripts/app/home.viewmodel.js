function HomeViewModel(app, dataModel) {
    var self = this;
    self.myHometown = ko.observable("");

    var setLpStatusUI = function (param) {

        if (param.started_time_of_processing) {
            $('#processing-time-st').text(param.started_time_of_processing);
        } else {
            $('#processing-time-st').text('');
        }
        if (param.started_time_of_loading) {
            $('#loading-time-st').text(param.started_time_of_loading);
        } else {
            $('#loading-time-st').text('');
        }
        if (param.finished_time_of_processing) {
            $('#processing-time-fh').text(param.finished_time_of_processing);
        } else {
            $('#processing-time-fh').text('');
        }
        if (param.finished_time_of_loading) {
            $('#loading-time-fh').text(param.finished_time_of_loading);
        } else {
            $('#loading-time-fh').text('');
        }
        if (typeof (param.processed_count) !== 'undefined') {
            $('#proc-count').text(param.processed_count);
        } else {
            $('#proc-count').text('');
        }
        if (typeof (param.status) !== 'undefined') {
            $('#status').text(param.status);
        } else {
            $('#status').text('');
        }

        if (typeof (param.data_name) !== 'undefined') {
            $('#data-name').text(param.data_name);
        } else {
            $('#data-name').text('');
        }
    };


    var pollingStatus = function () {
        postSyncLpStatus().then(function () {
            setTimeout(pollingStatus, 1000);
        });
    };



    var postSyncLpStatus = function () {

        var def;
        def = $.Deferred();

        var result;
        result = def;
        var ajxParam;
        ajxParam = {
            method: 'get',
            url: app.dataModel.lpstatus,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                setLpStatusUI(data);
                def.resolve(data);
            },
            error: function (xhr, status, errorThrown) {
                console.log(status);
                def.reject(state);
            }
        };

        $.ajax(ajxParam);

        return result;
    };

    var nameFileContainer = {};


    var syncUiWithFileData = function () {
        
        var form;
        form = $($('.upload-form')[0]);

        var submit;
        submit = $(form.find('input[type=submit]'));

        if (getFileData()) {
            submit.removeAttr('disabled');
        } else {
            submit.attr('disabled', true);
        }
    };


    var succeededSubmit = function (data, status, xhr) {
        console.log(status);

    };
    var failedSubmit = function (xhr, status, errorStr) {

        console.log(status);
    };

    var submit = function (event) {

        var dataHandler;
        dataHandler = function (submitData) {
            if (submitData) {
                var ajaxSetting;
                ajaxSetting = {
                    url: 'Home/Load',
                    method: 'POST',
                    success: succeededSubmit,
                    error: failedSubmit,
                    data: submitData
                };
                var strParam;
                strParam = $.param(ajaxSetting.data);

                $.ajax(ajaxSetting);
            }
        };

        createSubmitData().then(dataHandler);

        return false;
    };


    var createSubmitData = function () {
        var result;
        result = undefined;

        var def;
        def = $.Deferred();
        result = def;

        getDataContentAsHexString().then(
            function (data) {
                if (data) {
                    var dataType;
                    var dataName;
                    dataName = getDataName();

                    dataType = getDataType();

                    
                    var res;
                    res = { };
                    if (dataName) {
                        res.data_name = dataName;
                    }
                    if (dataType) {
                        res.data_type = dataType;
                    }
                    res.data = data;
                    def.resolve(res);
                } else {
                    def.reject();
                }
            },
            function () {
                def.reject();
            }
        );


        return result;
    };


    var getDataName = function () {
        var aFile;
        aFile = getFileData();
        var result;
        result = undefined;
        if (aFile) {
            var ext;
            ext = getDataType();
            result = aFile.name.slice(-ext.Length);
        }
        return result;
    };

    var getDataType = function () {

        var aFile;
        aFile = getFileData();
        var result;
        result = undefined;
        if (aFile) {
            var re;
            re = /(?:(\.[^.]+))?$/;
            result = re.exec(aFile.name)[1];
        }
        return result;
    };

    var getDataContentAsHexString = function () {

        var result;
        result = undefined;

        var def;
        def = $.Deferred();

        result = def;

        var aFile;
        aFile = getFileData();

        if (aFile) {
            var reader;
            reader = new FileReader();
            reader.onload = function (evt) {
                var contents;
                var hexStr;
                var aHex1;
                var aHex;
                var idx;
                contents = evt.target.result;
                hexStr = '';
                for (idx = 0; idx < contents.length; idx++) {
                    aHex = contents.charCodeAt(idx);
                    aHex1 = aHex.toString(16);
                    if (aHex1.length == 1) {
                        aHex1 = '0' + aHex1;
                    }
                    hexStr += aHex1;
                }
                def.resolve(hexStr);
            };
            reader.readAsBinaryString(aFile);
        } else {
            def.reject();
        }
        return result;
    };





    var getFileData = function () {
        var dropTarget;
        var dropBoxes;

        dropBoxes = $('.drop-box');
        dropTarget = $(dropBoxes[0]);

        var name;
        name = dropTarget.data('file');
        var result;
        result = undefined;
        if (name) {
            result = nameFileContainer[name];
        }

        return result;
    };

    var setFileData = function (file) {
        var dropTarget;
        var dropBoxes;

        dropBoxes = $('.drop-box');
        dropTarget = $(dropBoxes[0]);
        // dropTarget = $(dropBoxes);


        var oldFile;
        oldFile = getFileData();
        if (oldFile) {
            delete nameFileContainer[oldFile.name];
        }
        if (file) {
            dropTarget.data('file', file.name);
            nameFileContainer[file.name] = file;
        } else {
            dropTarget.removeData('file');
        }

        syncUiWithFileData();
    };


    var bindNode = function () {

        var dropHandler = function (e) {
            var dt;
            dt = undefined;
             if (e.originalEvent && e.originalEvent.dataTransfer) {
                dt = e.originalEvent.dataTransfer;
            }
            if (dt !== 'undefined') {
                setFileData(dt.files[0]);
                e.preventDefault();
            }
            
        };

        var dragOverHandler = function (e, elm) {
            e.preventDefault();
            e.stopPropagation();
            $(elm).addClass('dragging');
            return false;
        };

        var dragLeaveHandler = function (e, elm) {
            e.preventDefault();
            e.stopPropagation();
            $(elm).removeClass('dragging');
            return false;
        };

        var changeHandler = function (e) {
            if (e.originalEvent && e.originalEvent.target.files) {
                setFileData(e.originalEvent.target.files[0]);
            }
        };


        ['.drop-box'].forEach(function (className, index, params) {
            $(className).each(function (index1, dropTarget) {
                $(dropTarget).on('dragover', dragOverHandler);
                $(dropTarget).on('dragleave', dragLeaveHandler);
                $(dropTarget).on('drop', dropHandler);
            });

        });
        var form;
        form = $($('.upload-form')[0]);
        form.on('submit', submit);



        var fileInput;
        fileInput = $($('#file-selector'));
        fileInput.on('change', changeHandler);

    };

    $(document).ready(bindNode);

    Sammy(function () {
         this.get('#lp-status', function () {
             // postSyncLpStatus();
             pollingStatus();
         });
         this.get('/', function () { this.app.runRoute('get', '#lp-status'); });
    });

    

    return self;
}

app.addViewModel({
    name: "ProcessorStatus",
    bindingMemberName: "lp-status",
    factory: HomeViewModel
});
