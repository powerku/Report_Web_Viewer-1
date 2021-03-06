/******************************************************************
 기능 : FixedTable(고정 테이블)을 화면에 그려주는 함수를 만든다.
 만든이 : 하지연
 ******************************************************************/
function drawingFixedTable(data, controlFixedTable, fixTableLabelList, divId, numOfData, fixTableList, band) {
    if (data.IsApprovalBox._text == "true") {
    }
    var div = $('#' + divId);//divId = 밴드
    div.css('position', 'relative');

    div.append('<div id = "Table' + tableNum + '"></div>');//무의미한 테이블 div
    var divIdTable = $('#Table' + tableNum);
    divIdTable.css({
        'top': 0
    });
    var temp_table_class = controlFixedTable.id.substring(0, 4); // 임시로 table을 인식하기 위한 번호 - 전형준
    divIdTable.append('<table id="fixedTable' + fixedTableNum + '" class="table table-' + temp_table_class + '"></table>');
    var fixTableId = $('#fixedTable' + fixedTableNum);//고정테이블
    tdCount = 1;
    fixTableId.css({
        'width': controlFixedTable.rectangle.width,
        'height': controlFixedTable.rectangle.height,
        'border-spacing': 0,
        'padding': 0
    });
    var dt = Object.values(dataTable.DataSetName)[0];

    var fixTableWidth = controlFixedTable.rectangle.width;//고정테이블 width 값
    var fixTableHeight = controlFixedTable.rectangle.height;
    var fixTableLabelListLength = Number(fixTableLabelList.length);//고정테이블 라벨리스트 라벨 개수
    function countingRows() {
        var rowCount = 0;
        for (var q = 0; q < fixTableLabelListLength; q++) {
            if (fixTableLabelList[q].rectangle.x == '0') {
                rowCount++;
            }
        }
        setRowCount(rowCount);
    }

    countingRows();

    function setRowCount(rowCount) {
        var totalLabelWidth = 0;//라벨너비
        var labelCount = 0;//라벨개수
        var rowCount;//row개수

        if (data.Labels) {//라벨 리스트 라벨 width, height값 가져오기
            for (var i = 0; i < fixTableLabelListLength; i++) {
                var thisLabelWidth = Number(fixTableLabelList[i].rectangle.width);
                var thisLabelHeight = Number(fixTableLabelList[i].rectangle.height);
                var thisLabelX = fixTableLabelList[i].rectangle.x;

                labelCount++;
                totalLabelWidth += thisLabelWidth;
                if (fixTableWidth == totalLabelWidth) {
                    var drawingTds = labelCount;
                    totalLabelWidth = 0;
                }
                if (labelCount == fixTableLabelListLength) {
                    for (var i = 1; i <= rowCount; i++) {
                        fixTableId.append('<tr id = "fixedTableRow' + fixTableRowCount + '"></tr>');
                        var ThisfixedTableRow = $("#fixedTableRow" + fixTableRowCount);

                        ThisfixedTableRow.css({
                            'margin': 0,
                            'padding': 0,
                            'top': 0,
                            'width': fixTableWidth,
                            'overflow': 'visible'
                        });
                        if (drawingTds == undefined) {
                            var drawingTds = labelCount / rowCount;
                        }
                        if (rowCount = 1) {
                            var drawingTds = labelCount;
                        }
                        tdDataBinding(ThisfixedTableRow, drawingTds);
                        fixTableRowCount++;
                    }

                    function tdDataBinding(ThisfixedTableRow, drawingTds) {
                        var tdId = 'FixedTableLabel_';
                        if (tdCount > drawingTds) {
                            drawingTds = labelCount;
                        }
                        for (tdCount; tdCount <= drawingTds; tdCount++) {
                            var fromData = fixTableLabelList[tdCount - 1];
                            var tdLeft = fromData.rectangle.x;
                            var tdTop = fromData.rectangle.y;
                            var tdIDMaking = tdId + tdCount + '_' + labelC;
                            var tdIDwithS = $("#" + tdIDMaking);
                            switch (fromData.dataType) {
                                case  "DataLabel" :
                                    if (groupFieldArray !== undefined) {
                                        if (fromData.fieldName !== undefined) {
                                            var fieldName = fromData.fieldName;

                                            if (fieldName == groupFieldName) {
                                                if (groupFieldArray[groupFieldNum]) {
                                                    var showDataLabel = groupFieldArray[groupFieldNum][0];
                                                    if (showDataLabel === undefined) {
                                                        showDataLabel = ' ';
                                                    }
                                                }
                                            } else {
                                                if (groupFieldArray[groupFieldNum]) {
                                                    if (groupFieldArray[groupFieldNum][1][fieldName] !== undefined) {
                                                        var showDataLabel;
                                                        showDataLabel = groupFieldArray[groupFieldNum][1][fieldName]._text;
                                                    } else {
                                                        showDataLabel = ' ';
                                                    }
                                                } else {
                                                }
                                            }
                                        }

                                        var table_reform = table_format_check(data.Labels, tdIDwithS, showDataLabel, fromData);
                                        ThisfixedTableRow.append
                                        ('<td class="DataLabel" id = "' + tdId + tdCount + '_' + labelC + '">' +
                                            '<p id="' + tdId + tdCount + '_p_' + labelC + '">' + table_reform + '</p>' +
                                            '</td>');
                                        var tdId_javascript = $("#" + tdIDMaking);
                                        tdId_javascript.addClass("FixedTableLabel");
                                    }
                                    break;
                                case  "NormalLabel" :
                                    if (fromData.text === undefined) {
                                        fromData.text = ' ';
                                        var showDataLabel;
                                        showDataLabel = fromData.text;
                                    } else if (fromData.text !== undefined) {
                                        var showDataLabel;
                                        showDataLabel = fromData.text;
                                    }
                                    ThisfixedTableRow.append('<td class="NormalLabel" id = "' + tdId + tdCount + '_' + labelC + '">' +
                                        '<p id="' + tdId + tdCount + '_p_' + labelC + '">' + table_format_check(data.Labels, tdIDwithS, showDataLabel, fromData) + '</p></td>');
                                    var fixedtable_tdId = $('#' + tdId + tdCount + '_' + labelC);
                                    fixedtable_tdId[0].real_id = fromData.id;
                                    settingAttribute(fromData, tdId, tdCount, fixTableId, fixTableWidth, fixTableHeight, tdLeft, tdTop);
                                    var tdId_javascript = $("#" + tdIDMaking);
                                    if (fromData.editable !== "false") {
                                        tdId_javascript.addClass("Editable");
                                    }
                                    tdId_javascript.addClass("DynamicTableHeader");
                                    tdId_javascript.addClass("FixedTableLabel");
                                    break;
                                case "SummaryLabel" :
                                    var dt = dataTable.DataSetName[fromData.dataTableName];
                                    var key = fromData.fieldName;

                                    switch (fromData.summaryType) {
                                        case 'Sum' : //합계
                                            var summary_label_sum = 0;
                                            if (groupFieldArray.length !== 0) {//기준필드 있을때//테스트 안해봤음.
                                                for (var i = 0; i < groupFieldArray[groupFieldNum].length - 1; i++) {
                                                    summary_label_sum += Number(groupFieldArray[groupFieldNum][i + 1][key]._text);
                                                }
                                                showDataLabel = summary_label_sum;
                                            } else {//기준필드없을때
                                                if (dt !== undefined) {
                                                    for (var i = 0; i < dt.length; i++) {

                                                        if (dt[i][key] !== undefined) {
                                                            if (dt[i][key]._text !== undefined) {
                                                                summary_label_sum += Number(dt[i][key]._text);
                                                            }
                                                        }
                                                    }
                                                    showDataLabel = summary_label_sum;
                                                }
                                            }
                                            break;
                                        case 'Avg' : //평균
                                            var summary_label_sum = 0;
                                            var summary_label_avg = 0;

                                            if (groupFieldArray.length !== 0) { // 그룹 기준 필드가 있을 때//테스트 안해봤음.
                                                for (var i = 0; i < groupFieldArray[groupFieldNum].length - 1; i++) {
                                                    summary_label_sum += Number(groupFieldArray[groupFieldNum][i + 1][key]._text);
                                                }
                                                summary_label_avg = summary_label_sum / (groupFieldArray[groupFieldNum].length - 1);
                                            } else {
                                                if (dt !== undefined) {
                                                    for (var i = 0; i < dt.length; i++) {
                                                        if (dt[i][key] !== undefined) {
                                                            if (dt[i][key]._text !== undefined) {
                                                                summary_label_sum += Number(dt[i][key]._text);
                                                            }
                                                        }
                                                    }
                                                    showDataLabel = summary_label_sum;
                                                }
                                                summary_label_avg = summary_label_sum / dt.length;
                                            }
                                            showDataLabel = summary_label_avg;
                                            break;
                                        case 'Max' :
                                            var temp_arr = [];

                                            if (groupFieldArray.length != 0) {// 그룹 기준 필드가 있을 때
                                                for (var i = 0; i < groupFieldArray[groupFieldNum].length - 1; i++) {
                                                    temp_arr.push(Number(groupFieldArray[groupFieldNum][i+1][key]._text));
                                                }
                                                var summary_label_max = temp_arr.reduce(function(previous, current){
                                                    return previous > current ? previous : current;
                                                });
                                            } else {
                                                for(var i = 0; i < dt.length; i++){
                                                    if(dt[i][key]){
                                                        if(dt[i][key]._text != undefined){
                                                            temp_arr.push(Number(dt[i][key]._text));
                                                        }
                                                    }else{
                                                        temp_arr.push(Number(0));
                                                    }
                                                }
                                                var summary_label_max = temp_arr.reduce(function(previous, current){
                                                    return previous > current ? previous:current;
                                                });
                                            }
                                            showDataLabel = summary_label_max;
                                            break;
                                        case 'Min' :
                                            var temp_arr = [];

                                            if (groupFieldArray.length != 0) {// 그룹 기준 필드가 있을 때
                                                for (var i = 0; i < groupFieldArray[groupFieldNum].length - 1; i++) {
                                                    temp_arr.push(Number(groupFieldArray[groupFieldNum][i+1][key]._text));
                                                }
                                                var summary_label_min = temp_arr.reduce(function(previous, current){
                                                    return previous > current ? current : previous;
                                                });
                                            } else {
                                                for(var i = 0; i < dt.length; i++){
                                                    if(dt[i][key]){
                                                        if(dt[i][key]._text != undefined){
                                                            temp_arr.push(Number(dt[i][key]._text));
                                                        }
                                                    }else{
                                                        temp_arr.push(Number(0));
                                                    }
                                                }
                                                var summary_label_min = temp_arr.reduce(function(previous, current){
                                                    return previous > current ? current : previous;
                                                });
                                            }
                                            showDataLabel = summary_label_min;
                                            break;
                                        case 'Cnt' :
                                            var summary_label_cnt = 0;
                                            if (groupFieldArray.length !== 0) { // 그룹 기준 필드가 있을 때//테스트 안해봤음.
                                                summary_label_cnt = groupFieldArray[groupFieldNum].length - 1;
                                            } else {
                                                summary_label_cnt = dt.length;
                                            }
                                            showDataLabel = summary_label_cnt;
                                            break;
                                        default : //none
                                            showDataLabel = 'Default';
                                            break;
                                    }
                                    if (groupFieldArray !== undefined) {
                                        if (fromData.fieldName !== undefined) {
                                            var fieldName = fromData.fieldName;
                                            if (groupFieldArray[groupFieldNum]) {
                                                if (groupFieldArray[groupFieldNum][1][fieldName]) {
                                                    var showDataLabel = groupFieldArray[groupFieldNum][1][fieldName]._text;
                                                    if (showDataLabel !== undefined) {
                                                        showDataLabel = showDataLabel
                                                    }
                                                    if (typeof showDataLabel === 'undefined') {
                                                        showDataLabel = ' ';
                                                    }
                                                }
                                            } else {
                                            }
                                        }
                                        if (typeof showDataLabel === 'undefined') {
                                            showDataLabel = ' ';
                                        }
                                        var table_reform = table_format_check(data.Labels, tdIDwithS, showDataLabel, fromData);
                                        ThisfixedTableRow.append
                                        ('<td class="SummaryLabel" id = "' + tdId + tdCount + '_' + labelC + '">' +
                                            '<p id="' + tdId + tdCount + '_p_' + labelC + '">' + table_reform + '</p>' +
                                            '</td>');
                                        var fixedtable_tdId = $('#' + tdId + tdCount + '_' + labelC);
                                        fixedtable_tdId[0].real_id = fromData.id;
                                        var tdId_javascript = $("#" + tdIDMaking);
                                        if (fromData.editable !== "false") {
                                            tdId_javascript.addClass("Editable");
                                        }
                                        tdId_javascript.addClass("DynamicTableHeader");
                                        tdId_javascript.addClass("FixedTableLabel");
                                    }
                                    break;
                            }
                            settingAttribute(fromData, tdId, tdCount, fixTableId, fixTableWidth, fixTableHeight, tdLeft, tdTop);
                        }
                    }
                }
            }
        }
    }

    function setTable() {
        if (Array.isArray(fixTableLabelList)) {
            var MathfixTableWidth = Math.round(fixTableWidth);
            fixTableId.css({
                'position': 'absolute',
                'z-index': 999,
                //'width': Math.round(fixTableWidth),//어쩔수없었음 round안하면 테이블 width 소수점 자동으로 없애버림..,
                'width': MathfixTableWidth,//하지연
                'over-flow': 'visible',
                'height': fixTableHeight,
                'left': controlFixedTable.rectangle.x + 'px',
                'top': controlFixedTable.rectangle.y + 'px',
                'border': '0px',
                'border-spacing': '0px'

            });
            labelC++;
            thNum++;
            fixedTableLabelNum++;
        }
    }

    setTable();

    tableNum++;
    fixedTableNum++;
}

/******************************************************************
 기능 : 고정테이블 안의 FixedTableLabel의 속성을 구현하고, 적용시킨다.
 만든이 : 하지연
 ******************************************************************/
function settingAttribute(fromData, tdId, tdCount, fixTableId, fixTableWidth, fixTableHeight, tdLeft, tdTop) {

    var ThisFixedTableData = $("#" + tdId + tdCount + '_' + labelC);
    var ThisFixedTableDataP = $("#" + tdId + tdCount + '_p_' + labelC);

    var thisText = fromData.text;
    var thisTextLength = String(fromData.text).length;
    var textWithoutSpace = String(thisText).replace(/(\s*)/g, "");
    var textSize = fromData.fontSize.split('pt')[0];
    var fontWeight = fromData.fontWeight === undefined ? 'normal' : fromData.fontWeight;
    var textWithoutSpaceLength = textWithoutSpace.length;
    var dtBackgroundColor = fromData.backGroundColor === undefined ? 'none':fromData.backGroundColor;

    ThisFixedTableDataP.css({
        'top': 0,
        'left': 0
    });
    ThisFixedTableData.css({
        'background-color': dtBackgroundColor,
        'position': 'absolute',
        'left': tdLeft + 'px',
        'top': tdTop + 'px',
        'box-sizing': 'border-box',
        'font-weight': fontWeight
    });

    if (fromData.noBorder == 'true') {//border 없을때
        ThisFixedTableData.css('border', 'none');

        ThisFixedTableData.css({
            'width': fromData.rectangle.width,
            'height': fromData.rectangle.height,
            'float': 'left',
            'background-color': fromData.backGroundColor,
            'font-size': fromData.fontSize,
            'font-family': fromData.fontFamily,
            'font-weight': fromData.fontStyle,
            'padding': 0,
            // 'margin': '0',
            'border-spacing': '0px',
            'border-collapse': 'collapse',
            'color': fromData.textColor,
            // 'cellspacing': '0',
            'box-sizing': 'border-box'
        });
    } else {//border 있을때
        if (fromData.borderThickness !== undefined) {
            var leftBorderStyle = borderDottedLine(fromData.borderDottedLines.leftDashStyle);
            var rightBorderStyle = borderDottedLine(fromData.borderDottedLines.rightDashStyle);
            var bottomBorderStyle = borderDottedLine(fromData.borderDottedLines.bottomDashStyle);
            var topBorderStyle = borderDottedLine(fromData.borderDottedLines.topDashStyle);
            var leftThickness = Number(fromData.borderThickness.left);
            var rightThickness = Number(fromData.borderThickness.right);
            var bottomThickness = Number(fromData.borderThickness.bottom);
            var topThickness = Number(fromData.borderThickness.top);
            var height = Number(fromData.rectangle.height);
            var width = Number(fromData.rectangle.width);
            var topBorderColor = fromData.topBorderColor === undefined ? 'black' : fromData.topBorderColor;
            var bottomBorderColor = fromData.bottomBorderColor === undefined ? 'black' : fromData.bottomBorderColor;
            var rightBorderColor = fromData.rightBorderColor === undefined ? 'black' : fromData.rightBorderColor;
            var leftBorderColor = fromData.leftBorderColor === undefined ? 'black' : fromData.leftBorderColor;

            ThisFixedTableData.css({
                'width': width + 'px',
                'height': height + 'px',
                'float': 'left',
                'background-color': fromData.backGroundColor,
                'font-size': fromData.fontSize,
                'font-family': fromData.fontFamily,
                'font-weight': fromData.fontStyle,
                'padding': 0,
                'margin': 0,
                'border-top': topThickness + 'px ' + topBorderStyle + ' ' + topBorderColor,
                'border-bottom': bottomThickness + 'px ' + bottomBorderStyle + ' ' + bottomBorderColor,
                'border-right': rightThickness + 'px ' + rightBorderStyle + ' ' + rightBorderColor,
                'border-left': leftThickness + 'px ' + leftBorderStyle + ' ' + leftBorderColor,
                'border-collapse': 'collapse',
                'border-spacing': '0px', //
                'white-space': 'nowrap',
                'color': fromData.textColor,
                'overflow': 'visible',
                'box-sizing': 'border-box'
            });
        }
    }

    if (fromData.wordWrap == 'true') {
        ThisFixedTableData.css('white-space', 'normal');
    }
    if (fromData.visible == 'false') {//visible 속성
        ThisFixedTableData.css('display', 'none');
    }
    var VTextAlignment = fromData.verticalTextAlignment;
    var TextDirection = fromData.textDirection;

    if (topThickness !== undefined) {
        if (TextDirection == 'Vertical') {
            ThisFixedTableDataP.text(textWithoutSpace);
            var ptToPx = textSize / 0.75;  //pt를 px로 변환
            //textWithoutSpaceLength

            ThisFixedTableDataP.css({
                'width': ptToPx + 'px',
                'height': (textWithoutSpaceLength * ptToPx) + 'px',
                'display': 'inline-block',
                'box-sizing': 'border-box'
            });
            ThisFixedTableData.css({
                'white-space': 'normal'
            })
        } else if (Text == 'Horizontal') {
        }
    }

    function settingVerticalTextAlignment(VTextAlignment) {
        if (VTextAlignment !== undefined) {
            if (ThisFixedTableDataP.css('height') !== undefined) {
                var tagPHeight = Number(ThisFixedTableDataP.css('height').split('px')[0]);
                var dataHeight = Number(ThisFixedTableData.css('height').split('px')[0]);
                var tagPmarginTop = (dataHeight - tagPHeight) / 2;
                if (tagPHeight < dataHeight) {
                    if (tagPHeight !== undefined) {
                        if (dataHeight - tagPHeight >= 0) {


                            switch (VTextAlignment) {
                                case "Center": {
                                    ThisFixedTableDataP.css({
                                        '-webkit-margin-before': tagPmarginTop,
                                        'top': tagPmarginTop,
                                        'display': 'inline-block',
                                        'box-sizing': 'border-box'
                                    });
                                }
                                    break;
                                case "Top": {
                                    ThisFixedTableDataP.css({
                                        '-webkit-margin-before': 0,
                                        'top': 0,
                                        'display': 'inline-block'
                                    });
                                }
                                    break;
                                case "Bottom": {
                                    ThisFixedTableDataP.css({
                                        '-webkit-margin-before': tagPmarginTop * 2,
                                        'top': tagPmarginTop * 2,
                                        'display': 'inline-block'
                                    });
                                }
                                    break;
                            }
                        }
                    }
                } else if (dataHeight < tagPHeight) {
                    switch (VTextAlignment) {
                        case "Center": {
                            ThisFixedTableDataP.css({
                                '-webkit-margin-before': tagPmarginTop,
                                'top': tagPmarginTop,
                                'display': 'inline-block',
                                'box-sizing': 'border-box'
                            });
                        }
                            break;
                        case "Top": {
                            ThisFixedTableDataP.css({
                                '-webkit-margin-before': 0,
                                'top': 0,
                                'display': 'inline-block'
                            });
                        }
                            break;
                        case "Bottom": {
                            ThisFixedTableDataP.css({
                                '-webkit-margin-before': tagPmarginTop * 2,
                                'top': tagPmarginTop * 2,
                                'display': 'inline-block'
                            });
                        }
                            break;
                    }
                }
            }
        }
    }

    settingVerticalTextAlignment(VTextAlignment);
    var HTextAlignment = fromData.horizontalTextAlignment;

    function settingHorizontalTextAlignment(HTextAlignment) {
        if (HTextAlignment !== undefined) {
            var pWidth = (ThisFixedTableDataP.css('width')).split('px')[0];
            var dataWidth = (ThisFixedTableData.css('width')).split('px')[0];
            var subtraction =dataWidth-pWidth;
            if(HTextAlignment=='Right'){
                if(subtraction > 7){
                ThisFixedTableDataP.css('margin-right','7px');}
            }else if(HTextAlignment=='Left'){
               if(subtraction > 7){
                   ThisFixedTableDataP.css('margin-left','7px');
               }
            }else if(HTextAlignment=='Center'){
            }
            ThisFixedTableData.css("text-align", HTextAlignment);
        }
    }

    settingHorizontalTextAlignment(HTextAlignment);
}

/******************************************************************
 기능 : FixedTable(고정 테이블)이 리전 안에 있을 경우에 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : 하지연
 내용 : 고정테이블이 리전안에 잘 그려질 수 있도록 전반적인 수정
 ******************************************************************/
function drawingFixedTableInRegion(data, controlFixedTable, fixTableLabelList, divId, numOfData, fixTableList, band) {
    if (data.IsApprovalBox._text == "true") {
        //결재란일 경우 결재란에 대한 처리를 여기에 해줘야함. 코드 정리는 필요..
    }
    var div = $('#' + divId);//divId = 밴드
    div.css('position', 'relative');

    div.append('<div id = "Table' + tableNum + '"></div>');//무의미한 테이블 div
    var divIdTable = $('#Table' + tableNum);
    divIdTable.css({
        //'position': 'absolute', 지연수정
        'top': 0
    });

    var temp_table_class = controlFixedTable.id.substring(0, 4); // 임시로 table을 인식하기 위한 번호 - 전형준

    divIdTable.append('<table id="fixedTable' + fixedTableNum + '" class="table table-' + temp_table_class + '"></table>');
    var fixTableId = $('#fixedTable' + fixedTableNum);//고정테이블
    tdCount = 1;
    fixTableId.css({
        'width': controlFixedTable.rectangle.width,
        'height': controlFixedTable.rectangle.height,
        'padding': 0,
    });
    var dt = Object.values(dataTable.DataSetName)[0];

    var fixTableWidth = controlFixedTable.rectangle.width;//고정테이블 width 값
    var fixTableHeight = controlFixedTable.rectangle.height;
    var fixTableLabelListLength = Number(fixTableLabelList.length);//고정테이블 라벨리스트 라벨 갯수

    function countingRows() {
        var xZeroCount = 0;
        for (var q = 0; q < fixTableLabelListLength; q++) {
            if (fixTableLabelList[q].rectangle.x == '0') {
                xZeroCount++;
            }
        }
        setRowCount(xZeroCount);
    }

    countingRows();

    function setRowCount(xZeroCount) {
        var totalLabelWidth = 0;//라벨너비
        var labelCount = 0;//라벨개수
        var rowCount = xZeroCount;//row개수

        if (data.Labels) {//라벨 리스트 라벨 width, height값 가져오기
            for (var i = 0; i < fixTableLabelListLength; i++) {
                var thisLabelWidth = Number(fixTableLabelList[i].rectangle.width);//
                var thisLabelHeight = Number(fixTableLabelList[i].rectangle.height);
                var thisLabelX = fixTableLabelList[i].rectangle.x;

                labelCount++;
                totalLabelWidth += thisLabelWidth;
                if (labelCount == fixTableLabelListLength) {
                    // rowCount = xZeroCount;
                    for (var i = 1; i <= rowCount; i++) {
                        fixTableId.append('<tr id = "fixedTableRow' + fixTableRowCount + '"></tr>');
                        var ThisfixedTableRow = $("#fixedTableRow" + fixTableRowCount);
                        ThisfixedTableRow.css({
                            'position': 'absolute',
                            'margin': 0,
                            'padding': 0,
                            'top': 0,
                            'width': fixTableWidth,
                            'overflow': 'visible'
                        });

                        var drawingTds = labelCount / rowCount;

                        tdDataBinding(ThisfixedTableRow, drawingTds);
                        fixTableRowCount++;
                    }

                    function tdDataBinding(ThisfixedTableRow, drawingTds) {
                        var tdId = 'FixedTableLabel_';
                        if (rowCount == '1') {
                            drawingTds = labelCount;
                        }
                        for (var tdCount = 1; tdCount <= drawingTds; tdCount++) {
                            var fromData = fixTableLabelList[tdCount - 1];

                            var tdLeft = fromData.rectangle.x;
                            var tdTop = fromData.rectangle.y;
                            var tdIDMaking = tdId + tdCount + '_' + labelC;
                            var tdIDwithS = $("#" + tdIDMaking);

                            switch (fromData.dataType) {
                                case  "DataLabel" :
                                    if (groupFieldArrayInRegion !== undefined) {
                                        if (fromData.fieldName !== undefined) {
                                            var fieldName = fromData.fieldName;
                                            if (fieldName == groupFieldName) {
                                                if (groupFieldArrayInRegion[groupFieldNumInRegion]) {
                                                    var showDataLabel = groupFieldArrayInRegion[groupFieldNumInRegion][0];
                                                    if (showDataLabel === undefined) {
                                                        showDataLabel = ' ';
                                                    }
                                                }
                                            } else {
                                                if (groupFieldArrayInRegion[groupFieldNumInRegion]) {
                                                    if (groupFieldArrayInRegion[groupFieldNumInRegion][1][fieldName] !== undefined) {
                                                        var showDataLabel;
                                                        showDataLabel = groupFieldArrayInRegion[groupFieldNumInRegion][1][fieldName]._text;
                                                    } else {
                                                        showDataLabel = ' ';
                                                    }
                                                } else {
                                                }
                                            }
                                        }
                                        var table_reform = table_format_check(data.Labels, tdIDwithS, showDataLabel, fromData);
                                        ThisfixedTableRow.append
                                        ('<td class="DataLabel" id = "' + tdId + tdCount + '_' + labelC + '">' +
                                            '<p id="' + tdId + tdCount + '_p_' + labelC + '">' + table_reform + '</p>' +
                                            '</td>');
                                        var tdId_javascript = $("#" + tdIDMaking);
                                        tdId_javascript.addClass("FixedTableLabel");
                                    }
                                    break;
                                case  "NormalLabel" :
                                    if (fromData.text === undefined) {
                                        fromData.text = ' ';
                                    }
                                    ThisfixedTableRow.append('<td class="NormalLabel" id = "' + tdId + tdCount + '_' + labelC + '">' +
                                        '<p id="' + tdId + tdCount + '_p_' + labelC + '">' + table_format_check(data.Labels, tdIDwithS, fromData.text, fromData) + '</p></td>');
                                    var tdId_javascript = $("#" + tdIDMaking);
                                    tdId_javascript.addClass("FixedTableLabel");
                                    break;
                                case "SummaryLabel" :
                                    fromData.summaryType = fromData.SummaryType === undefined ? 'Sum' : fromData.SummaryType._text;//요약타입
                                    fromData.detailWhere = fromData.DetailWhere === undefined ? undefined : fromData.DetailWhere._text; //요약라벨 조건절
                                    fromData.fieldName = fromData.fieldName === undefined ? undefined : fromData.fieldName;//필드이름.
                                    var dt = dataTable.DataSetName[fromData.dataTableName];
                                    var key = fromData.fieldName;

                                    switch (fromData.summaryType) {
                                        case 'Sum' : //합계
                                            var summary_label_sum = 0;
                                            if (groupFieldArray.length !== 0) {//기준필드 있을때//테스트 안해봤음.
                                                for (var i = 0; i < groupFieldArray[groupFieldNum].length - 1; i++) {
                                                    summary_label_sum += Number(groupFieldArray[groupFieldNum][i + 1][key]._text);
                                                }
                                                showDataLabel = summary_label_sum;
                                            } else {//기준필드없을때
                                                if (dt !== undefined) {
                                                    for (var i = 0; i < dt.length; i++) {

                                                        if (dt[i][key] !== undefined) {
                                                            if (dt[i][key]._text !== undefined) {
                                                                summary_label_sum += Number(dt[i][key]._text);
                                                            }
                                                        }
                                                    }
                                                    showDataLabel = summary_label_sum;
                                                }
                                            }
                                            break;
                                        case 'Avg' : //평균
                                            var summary_label_sum = 0;
                                            var summary_label_avg = 0;

                                            if (groupFieldArray.length !== 0) { // 그룹 기준 필드가 있을 때//테스트 안해봤음.
                                                for (var i = 0; i < groupFieldArray[groupFieldNum].length - 1; i++) {
                                                    summary_label_sum += Number(groupFieldArray[groupFieldNum][i + 1][key]._text);
                                                }
                                                summary_label_avg = summary_label_sum / (groupFieldArray[groupFieldNum].length - 1);
                                            } else {
                                                for (var i = 0; i < dt.length; i++) {
                                                    summary_label_sum += Number(dt[i][key]._text);
                                                }
                                                summary_label_avg = summary_label_sum / dt.length;
                                            }
                                            showDataLabel = summary_label_sum;
                                            break;
                                        case 'Max' :
                                            break;
                                        case 'Min' :
                                            break;
                                        case 'Cnt' :
                                            break;
                                        default : //none
                                            break;

                                    }

                                    if (groupFieldArray !== undefined) {
                                        if (fromData.fieldName !== undefined) {
                                            var fieldName = fromData.fieldName;

                                            if (groupFieldArray[groupFieldNum]) {
                                                if (groupFieldArray[groupFieldNum][1][fieldName]) {
                                                    var showDataLabel = groupFieldArray[groupFieldNum][1][fieldName]._text;
                                                    if (showDataLabel !== undefined) {
                                                        showDataLabel = showDataLabel
                                                    }
                                                    if (typeof showDataLabel === 'undefined') {
                                                        showDataLabel = ' ';
                                                    }
                                                }
                                            } else {
                                            }
                                        }
                                        if (typeof showDataLabel === 'undefined') {
                                            showDataLabel = ' ';
                                        }
                                        var table_reform = table_format_check(data.Labels, tdIDwithS, showDataLabel, fromData);
                                        ThisfixedTableRow.append
                                        ('<td class="SummaryLabel" id = "' + tdId + tdCount + '_' + labelC + '">' +
                                            '<p id="' + tdId + tdCount + '_p_' + labelC + '">' + table_reform + '</p>' +
                                            '</td>');
                                        var tdId_javascript = $("#" + tdIDMaking);
                                    }
                                    break;
                            }
                            settingAttribute(fromData, tdId, tdCount, fixTableId, fixTableWidth, fixTableHeight, tdLeft, tdTop);
                        }
                    }
                }
            }
        }
    }

    setRowCount();

    function setTable() {
        if (Array.isArray(fixTableLabelList)) {
            var MathfixTableWidth = Math.round(fixTableWidth);
            fixTableId.css({
                'position': 'absolute',
                'z-index': 999,
                //'width': Math.round(fixTableWidth),//어쩔수없었음 round안하면 테이블 width 소수점 자동으로 없애버림..,
                'width': MathfixTableWidth,//하지연
                'over-flow': 'visible',
                'height': fixTableHeight,
                'left': controlFixedTable.rectangle.x + 'px',
                'top': controlFixedTable.rectangle.y + 'px',
                //'border-collapse': 'collapse',
                //'border':'0.5px solid black',//임시로 이렇게 줘봤음 일단
                'border': '0px'
            });
            labelC++;
            thNum++;
            fixedTableLabelNum++;
        }
    }

    setTable();

    tableNum++;
    fixedTableNum++;
}

/******************************************************************
 기능 : FixedTable(고정 테이블)이 데이터 밴드 안에 있을 경우에 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : 하지연
 내용 : 고정테이블이 리전안에 잘 그려질 수 있도록 전반적인 수정
 ******************************************************************/
function drawingFixedTableInDataBand(data, controlFixedTable, fixTableLabelList, fixedTableDivId, curDataRowInDataBand, fixTableList, band) {
    // TODO 몇 번째 데이터를 찍고 있는지 알아야 함!
    if (data.IsApprovalBox._text == "true") {
        //결재란일 경우 결재란에 대한 처리를 여기에 해줘야함. 코드 정리는 필요..
    }
    var fixedTableDiv = $('#' + fixedTableDivId);// 밴드
    fixedTableDiv.css('position', 'relative');
    // fixedTableDiv.css('background-color', 'lightgreen');

    fixedTableDiv.append('<div id = "Table' + tableNum + '"></div>');//무의미한 테이블 div
    var divIdTable = $('#Table' + tableNum);
    divIdTable.css({
        'position': 'absolute',
        'top': 0
    });
    var temp_table_class = controlFixedTable.id.substring(0, 4); // 임시로 table을 인식하기 위한 번호 - 전형준

    divIdTable.append('<table id="fixedTable' + fixedTableNum + '" class="table table-' + temp_table_class + '"></table>');
    var fixTableId = $('#fixedTable' + fixedTableNum);//고정테이블
    tdCount = 1;
    fixTableId.css({
        'width': controlFixedTable.rectangle.width,
        'height': controlFixedTable.rectangle.height,
        'padding': 0
    });
    var dt = Object.values(dataTable.DataSetName)[0];

    var fixTableWidth = controlFixedTable.rectangle.width;//고정테이블 width 값
    var fixTableHeight = controlFixedTable.rectangle.height;
    var fixTableLabelListLength = Number(fixTableLabelList.length);//고정테이블 라벨리스트 라벨 갯수

    function countingRows() {
        var xZeroCount = 0;
        for (var zz = 0; zz < fixTableLabelListLength; zz++) {
            if (fixTableLabelList[zz].rectangle.x == '0') {
                xZeroCount++;
            }
        }
        setRowCount(xZeroCount);
    }

    countingRows();

    function setRowCount(xZeroCount) {
        var totalLabelWidth = 0;//라벨너비
        var labelCount = 0;//라벨개수
        var rowCount = 0;//row개수

        if (data.Labels) {//라벨 리스트 라벨 width, height값 가져오기
            for (var i = 0; i < fixTableLabelListLength; i++) {
                var thisLabelWidth = Number(fixTableLabelList[i].rectangle.width);
                var thisLabelHeight = Number(fixTableLabelList[i].rectangle.height);
                var thisLabelX = fixTableLabelList[i].rectangle.x;

                labelCount++;
                totalLabelWidth += thisLabelWidth;

                if (labelCount == fixTableLabelListLength) {
                    rowCount = xZeroCount;
                    for (var rC = 1; rC <= rowCount; rC++) {
                        fixTableId.append('<tr id = "fixedTableRow' + fixTableRowCount + '"></tr>');
                        var ThisfixedTableRow = $("#fixedTableRow" + fixTableRowCount);

                        ThisfixedTableRow.css({
                            'position': 'absolute',
                            'margin': 0,
                            'padding': 0,
                            'top': 0,
                            //'width': thisLabelWidth,
                            //'height': thisLabelHeight,
                            'overflow': 'visible'
                        });

                        var drawingTds = labelCount / rowCount;

                        tdDataBinding(ThisfixedTableRow, drawingTds);
                        fixTableRowCount++;
                    }

                    function tdDataBinding(ThisfixedTableRow, drawingTds) {
                        var tdId = 'FixedTableLabel_';
                        if (tdCount > drawingTds) {
                            drawingTds = labelCount;
                        }
                        for (tdCount; tdCount <= drawingTds; tdCount++) {
                            var fromData = fixTableLabelList[tdCount - 1];

                            var tdIDMaking = tdId + tdCount + '_' + labelC;
                            var tdIDwithS = $("#" + tdIDMaking);

                            switch (fromData.dataType) {
                                case  "DataLabel" :
                                    if (groupFieldArray !== undefined) {
                                        if (fromData.fieldName !== undefined) {
                                            var fieldName = fromData.fieldName;

                                            if (fieldName == groupFieldName) {
                                                if (groupFieldArray[groupFieldNum]) {
                                                    var showDataLabel = groupFieldArray[groupFieldNum][0];
                                                    if (showDataLabel === undefined) {
                                                        showDataLabel = ' ';
                                                    }
                                                }
                                            } else {
                                                if (groupFieldArray[groupFieldNum]) {
                                                    if (groupFieldArray[groupFieldNum][1][fieldName] !== undefined) {
                                                        var showDataLabel;
                                                        showDataLabel = groupFieldArray[groupFieldNum][1][fieldName]._text;
                                                    } else {
                                                        showDataLabel = ' ';
                                                    }
                                                } else {
                                                }
                                            }
                                        } else { /////////// 추가한 부분
                                            ThisfixedTableRow.append
                                            ('<td class="DataLabel" id = "' + tdId + tdCount + '_' + fixedTableNum + '">' +
                                                '<p id="' + tdId + tdCount + '_p_' + fixedTableNum + '">' + dt[curDataRowInDataBand] + '</p>' +
                                                '</td>');
                                            settingAttribute(fromData, tdId, tdCount, fixTableId, fixTableWidth, fixTableHeight);
                                            setTable();
                                            var tdId_javascript = $("#" + tdIDMaking);
                                            tdId_javascript.addClass("FixedTableLabel");
                                            if (curDataRowInDataBand < dt.length) {
                                                curDataRowInDataBand++;
                                            }
                                        }
                                        if (typeof showDataLabel === 'undefined') {
                                            showDataLabel = ' ';
                                        }
                                        var table_reform = table_format_check(data.Labels, tdIDwithS, showDataLabel, fromData);
                                        ThisfixedTableRow.append
                                        ('<td class="DataLabel" id = "' + tdId + tdCount + '_' + labelC + '">' +
                                            '<p id="' + tdId + tdCount + '_p_' + labelC + '">' + table_reform + '</p>' +
                                            '</td>');
                                        settingAttribute(fromData, tdId, tdCount, fixTableId, fixTableWidth, fixTableHeight);
                                        setTable();
                                        var tdId_javascript = $("#" + tdIDMaking);
                                        tdId_javascript.addClass("FixedTableLabel");
                                    }
                                    break;
                                case  "NormalLabel" :
                                    ThisfixedTableRow.append('<td class="NormalLabel" id = "' + tdId + tdCount + '_' + labelC + '">' +
                                        '<p id="' + tdId + tdCount + '_p_' + labelC + '">' + table_format_check(data.Labels, tdIDwithS, fromData.text, fromData) + '</p></td>');
                                    settingAttribute(fromData, tdId, tdCount, fixTableId, fixTableWidth, fixTableHeight);
                                    setTable();
                                    var tdId_javascript = $("#" + tdIDMaking);
                                    tdId_javascript.addClass("FixedTableLabel");
                                    break;
                                // case "SummaryLabel" :
                                //     var label = new DataLabel(data);
                                //     drawingSummaryLabel(label);
                                //     ThisfixedTableRow.append('<td class="SummaryLabel" id = "' + tdId + tdCount + '_' + fixedTableNum + '">' +
                                //         '<p id="' + tdId + tdCount + '_p_' + fixedTableNum + '">' + table_format_check(data.Labels, tdIDwithS, fromData.text, fromData) + '</p></td>');
                                //     break;
                            }
                        }
                    }
                }
            }
        }
    }

    setRowCount();

    function setTable() {
        if (Array.isArray(fixTableLabelList)) {
            var MathfixTableWidth = Math.round(fixTableWidth);
            fixTableId.css({
                'position': 'absolute',
                'z-index': 999,
                //'width': Math.round(fixTableWidth),//어쩔수없었음 round안하면 테이블 width 소수점 자동으로 없애버림..,
                'width': MathfixTableWidth,//하지연
                'over-flow': 'visible',
                'height': fixTableHeight,
                'left': controlFixedTable.rectangle.x + 'px',
                'top': controlFixedTable.rectangle.y + 'px',
                'border-collapse': 'collapse',
                //'box-sizing':'border-box',
                //'border':'0.5px solid black',//임시로 이렇게 줘봤음 일단
                'border': '0px'
            });
            labelC++;
            thNum++;
            fixedTableLabelNum++;
        }
    }

    tableNum++;
    fixedTableNum++;
}
