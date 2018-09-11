// 작성자 : 전형준
var bandNum = 1;
var footer_height = 0;
var minGroupBandDataHeight = 0;
var remainData = false;
var numofData = 0;
var groupDataRow = 1;

/***********************************************************
 * 기능 : 최소 그룹 데이터 길이
 *  그룹 헤더길이 + 테이블 타이틀 길이 + 테이블 Value 길이
 * 만든이 : 구영준
 * *********************************************************/
function getMinGroupBandDataHeight(band) {
    var tableSpacing = 0;

    if (band.controlList.anyType.Rectangle.Y !== undefined) {
        tableSpacing = Number(band.controlList.anyType.Rectangle.Y._text);
    }

    var bandGroupHeaderHeight = Number(band.childHeaderBands[0].rectangle.height);
    var tableLabel = band.controlList.anyType.Labels.TableLabel;
    var tableTitleHeight = Number(tableLabel[0].Rectangle.Height._text);
    var tableValueHeight = Number(tableLabel[tableLabel.length - 1].Rectangle.Height._text);

    minGroupBandDataHeight = tableSpacing + bandGroupHeaderHeight + tableTitleHeight + tableValueHeight;
}

/***********************************************************
 * 기능 : 데이터 밴드 하위의 모든 밴드 길이 합
 * 만든이 : 구영준
 * *********************************************************/
function getFooterHeight(bands) {
    footer_height = 0;
    var bandDataIndex;
    for (var i = 0; i < bands.length; i++) {
        if (bands[i].attributes["xsi:type"] === "BandData") {
            bandDataIndex = i;
        }
        if (i > bandDataIndex) {
            footer_height += Number(bands[i].rectangle.height);
        }
    }
}

/***********************************************************
 * 기능 : 데이터 밴드 밑의 풋터 길이를 제외한 여백을 구함
 * 만든이 : 구영준
 * *********************************************************/
function getAvaHeight(div_id, reportHeight) {
    var $divId = '#' + div_id;
    var avaHeight = 0;
    if ($($divId).hasClass('designLayer')) {
        avaHeight = reportHeight;
    } else {
        var siblings = $($divId).siblings();
        // var curr_height = parseInt($($divId).css('height').substring(0, $($divId).css('height').length - 2));
        var curr_height = 0;

        for (var i = 0; i < siblings.length; i++) {
            curr_height += parseInt(siblings.eq(i).css('height').substring(0, siblings.eq(i).css('height').length - 2));
        }
        avaHeight = reportHeight - curr_height - footer_height;
    }

    return avaHeight;
}

/***********************************************************
 기능 : 그룹 헤더/풋터 일 경우 데이터 밴드 길이 계산
 1. 그룹 헤더/풋터 일 경우 그룹 데이터의 길이 만큼의 데이터 길이
 2. th 길이 + td길이 * 데이터 개수
 만든이 : 구영준
 * *********************************************************/
function getNumOfDataWithGroupField(band, avaHeight) {

    var dataCount = groupFieldArray[groupFieldNum].length;
    var labels = band.controlList.anyType.Labels.TableLabel;

    var titleHeight = Number(labels[0].Rectangle.Height._text);
    var valueHeight = Number(labels[labels.length - 1].Rectangle.Height._text);
    var bandGroupFooterHeight = 0;

    band.childFooterBands.forEach(function (child) {
        bandGroupFooterHeight = child.rectangle.height;
    });

    var numofData = Math.floor((avaHeight - titleHeight) / valueHeight);
    var groupRemainData = (dataCount - groupDataRow);

    if (numofData > groupRemainData) { // 마지막 페이지
        return dataCount;
    } else { //마지막 페이지가 아닌 경우
        return numofData;
    }

}

/***********************************************************
 * 리포트에 밴드들을 그려줌(ChildBands 들을 그려주기 위해 재귀함수로 사용)
 * 인자 bands : 그려줄 밴드들 // layerName : 어느 Layer에 그려줄 지
 *
 * 수정 : 2018-08-22
 * BandData일 경우 페이지 크기에 맞게 BandData Height 변경
 * from 구영준
 *
 * 수정 : 2018-08-31
 * 그룹 헤더 밴드 구현
 * from 구영준
 *
 * 수정 : 2018-09-07
 *  데이터밴드의 자식 밴드들을 함수로 빼서 구현
 * from 안예솔
 * *********************************************************/
function drawBand(bands, layerName, reportHeight, parentBand) {

    var avaHeight = 0;
    var dt = Object.values(dataTable.DataSetName)[0];

    bands.some(function (band) {

        switch (band.attributes["xsi:type"]) {
            case 'BandPageHeader' :
                if (band.pageOutputSkip === "true") {
                    return false;
                }
                break;
            case 'BandTitle' :
                if (reportPageCnt > 1) {
                    return false;
                }
                break;
        }

        if (band.childHeaderBands !== null) { // 자식헤더밴드에서 재호출
            drawChildHeaderBand(band.childHeaderBands, layerName, reportHeight, band); // 자식 밴드를 그려주는 함수 호출
        }
        var div_id = 'band' + (bandNum++);
        if (band.attributes["xsi:type"] !== "BandSubReport") {
            $('#' + layerName).append("<div id='" + div_id + "' class='Band " + band.attributes["xsi:type"] + "'>" + band.name + "</div>");
            $("#"+div_id).css('pointer-events', 'none');
        }

        // // xml 에서 넘어오는 BandForeGround, BandBackGround 영역을 대신 해 DesignLayer에 통합하여 순서를 정해주는 방안으로 변경.
        // if (band.attributes["xsi:type"] === "BandForeGround") {
        //     // $('.BandForeGround').each(function (i, e) {
        //     //     e.style.zIndex = 0;
        //     //     e.style.position = 'absolute';
        //     //     e.style.top = 0;
        //     //     // e.style.display = "none";
        //     // });
        //     div_id = layerName;
        // }
        // if (band.attributes["xsi:type"] === "BandBackGround") {
        //     // $('.BandBackGround').each(function (i, e) {
        //     //     e.style.zIndex = 0;
        //     //     e.style.position = 'absolute';
        //     //     e.style.top = 0;
        //     //     // e.style.display = "none";
        //     // });
        //     div_id = layerName;
        // }

        switch (band.attributes["xsi:type"]) {
            case 'BandData' :
                if (bands.length > 1) {
                    getFooterHeight(bands);
                }
                if (groupFieldArray.length > 0 && band.childHeaderBands !== null) { // band.childHeaderBands !== null 추가
                    if (isDynamicTable == true) {
                        getMinGroupBandDataHeight(band);
                        avaHeight = getAvaHeight(div_id, reportHeight);
                        numofData = getNumOfDataWithGroupField(band, avaHeight);
                        if (remainData) {
                            dataBandHeight = getBandHeightWithGroupField(band, numofData - groupDataRow);
                        } else {
                            dataBandHeight = getBandHeightWithGroupField(band, numofData - 1);
                        }

                        $('#' + div_id).css({
                            'width': band.rectangle.width,
                            'height': dataBandHeight,
                        });
                    } else { // 동적 테이블이 없을 때
                        $('#' + div_id).css({
                            'width': band.rectangle.width,
                            'height': band.rectangle.height
                        });
                    }
                } else {
                    if (isDynamicTable == true) {
                        dataBandHeight = getAvaHeight(div_id, reportHeight);
                        if (band.childFooterBands !== null) { // 자식 풋터 밴드에서 재호출
                            var dataBandFooterHeight = getChildBandHeight(band);
                        }
                        if (band.controlList.anyType.Labels !== undefined) { // 자식 풋터 밴드에서 재호출
                            var tableLabel = band.controlList.anyType.Labels.TableLabel;
                        }
                        $('#' + div_id).css({
                            'width': band.rectangle.width,
                            'height': dataBandHeight - dataBandFooterHeight,
                        });
                        if (band.controlList.anyType.Labels !== undefined) { // 자식 풋터 밴드에서 재호출
                            numofData = getNumOfDataInOnePageNonObject(tableLabel, div_id);
                        }
                    } else { // 동적 테이블이 없을 때
                        $('#' + div_id).css({
                            'width': band.rectangle.width,
                            'height': band.rectangle.height
                        });
                    }
                }
                break;
            case 'BandDummyFooter' :
                //ToDo 그룹 필드 데이터가 아닐경우 Error
                avaHeight = getAvaHeight(div_id, reportHeight);
                if (avaHeight < Number(band.rectangle.height)) {
                    console.log('remove');
                    remainBand = bands;
                    $('#' + div_id).remove();
                    return true;
                }
                break;
            case 'BandGroupFooter' :
                //ToDo 그룹 필드 데이터가 아닐경우 Error

                avaHeight = getAvaHeight(div_id, reportHeight);
                if (avaHeight < Number(band.rectangle.height)) {
                    remainBand = bands;
                    $('#' + div_id).remove();
                    return true;
                }
                break;
    }
            if(band.attributes["xsi:type"] !== "BandSubReport"){
                judgementControlList(band, div_id, numofData); // 라벨을 그려줌
            }
        switch (band.attributes["xsi:type"]) {
        case 'BandData' :
            var dataBandHeight = 0;
                if (groupFieldArray.length > 0 && band.childHeaderBands !== null) {
                    // childHeaderBands중에 BandGroupHeader가 있는 지 판단하기!
                    if(isDynamicTable == true) {
                        var dataCount = groupFieldArray[groupFieldNum].length;
                        var groupRemainData = (dataCount - groupDataRow);

                        if (numofData > groupRemainData) { // 마지막 페이지
                            curDatarow += groupFieldArray[groupFieldNum].length;
                            groupFieldNum++;
                            remainData = false;
                            groupDataRow = 1;
                        } else { //마지막 페이지가 아닌 경우
                            remainData = true;
                            groupDataRow += numofData - 1;
                        }
                    }
                } else { //그룹 필드가 아닐 경우
                curDatarow += numofData;
            }
            break;
        case 'BandSubReport' :
            $('#' + div_id).css({
                'width': band.rectangle.width,
                'height': band.rectangle.height,
                'border-bottom': "1px solid red",
                    'zIndex': -10
            });
            break;
        case 'BandPageFooter' :
            $('#' + div_id).css({
                'width': band.rectangle.width,
                'height': band.rectangle.height,
                'position': 'absolute',
                'bottom': 0 + "px",
            });
            break;
        case 'BandGroupHeader', 'BandGroupFooter' :
                if (band.invisible === 'true') {
                $('#' + div_id).css({
                    'width': band.rectangle.width,
                    'height': band.rectangle.height,
                        'display': 'none'
                });
                } else {
                $('#' + div_id).css({
                    'width': band.rectangle.width,
                    'height': band.rectangle.height,
                });
            }
            break;
        case 'BandSummary' :
            $('#' + div_id).css({
                'width': band.rectangle.width,
                'height': band.rectangle.height,
                'border-bottom': "1px solid red",
                    'zIndex': -10
            });
            break;
        default :
            $('#' + div_id).css({
                'width': band.rectangle.width,
                'height': band.rectangle.height,
            });
            break;
    }
    /**************************************************************************************
     * 그룹 풋터 일 경우
     *
     * 페이지 넘기기가 true 면 그룹 풋터 밴드가 그려지고 페이지가 끝
     *                 false면 데이터 밴드가 다시 그려짐
     *
     * 데이터 밴드가 다시 그려질 때,
     * 현재 페이지에서 여유 공간 = 리포트 길이 = 그룹 풋터 밴드 상위의 밴드 길이 - 풋터 밴들 길이
     *
     * 최소 그룹데이터 길이 = 그룹헤더길이 + 동적테이블 title Height  + 동적테이블 value Height 길이
     *
     * 여유 공간이 최소 그룹데이터 길이보다 클 경우
     * 다시 데이터 밴드 그림
     *
     * 만든 사람 : 구영준...
     *
     **************************************************************************************/
    if (band.attributes["xsi:type"] === "BandGroupFooter") {
        if (curDatarow < dt.length) {
                if (band.forceNewPage === 'true') { //페이지 넘기기

            } else {
                    if(isDynamicTable == true)
                        avaHeight = getAvaHeight(div_id, reportHeight);

                if (avaHeight > minGroupBandDataHeight) {
                    parentBand = (function (arg) {
                        var band = [];
                        band.push(arg);
                        return band;
                    })(parentBand);
                    drawBand(parentBand, layerName, reportHeight);
                }
            }
        }
    }

    if (band.childFooterBands !== null) { // 자식 풋터 밴드에서 재호출
        drawChildFooterBand(band.childFooterBands, layerName, reportHeight, band); // 자식 밴드를 그려주는 함수 호출
    }
}

)
;
}

/***********************************************************
 기능 : 밴드들의 childHeaderBand를 그린다.
 만든이 : 안예솔
 * *********************************************************/
function drawChildHeaderBand(childBands, layerName, reportHeight, band) {
    var childHeaderBandArray = new Array();
    childBands.forEach(function (childBand) {
        switch (childBand.attributes["xsi:type"]) {
            case 'BandGroupHeader' :
                if (!remainData) {
                    childHeaderBandArray.push(childBand);
                } else {
                    if (band.fixPriorGroupHeader === 'true') { //그룹 헤더 고정
                        childHeaderBandArray.push(childBand);
                    }
                }
                break;
            case 'BandDataHeader' : // 데이터 헤더 밴드
                if (band.fixTitle == 'true') { // 데이터 헤더 밴드 고정 값이 '예'일 때
                    childHeaderBandArray.push(childBand); // 매 페이지마다 나와야 함
                } else { // 데이터 헤더 밴드 고정 값이 '아니오'일 때
                    if (reportPageCnt == 1) { // 첫 페이지만 나옴
                        childHeaderBandArray.push(childBand);
                    }
                }
                break;
            case 'BandDummyHeader' :
                var isGroupHeader = false;
                childBands.forEach(function (childBand) {
                    if (childBand.attributes["xsi:type"] == 'BandGroupHeader') {
                        isGroupHeader = true;
                    }
                });
                if (isGroupHeader) { // 그룹 헤더가 있을 때는 그룹의 맨 처음에 출력 O
                    if (groupDataRow == 1) {
                        childHeaderBandArray.push(childBand);
                    }
                } else { // 그룹 헤더가 없을 때는 인쇄물의 첫 페이지에만 출력
                    if (reportPageCnt == 1) {
                        childHeaderBandArray.push(childBand);
                    }
                }
                break;
        }
    });
    drawBand(childHeaderBandArray, layerName, reportHeight, band);
}

/***********************************************************
 기능 : 밴드들의 childFooterBand를 그린다.
 만든이 : 안예솔
 * *********************************************************/
function drawChildFooterBand(childBands, layerName, reportHeight, band) {
    var childFooterBandArray = new Array();
    var dt = Object.values(dataTable.DataSetName)[0];
    childBands.forEach(function (childBand) {
        switch (childBand.attributes["xsi:type"]) {
            case 'BandGroupFooter' :
                if (!remainData) {
                    childFooterBandArray.push(childBand);
                } else {
                    if (band.fixPriorGroupFooter == 'true') { //그룻 풋터 고정
                        childFooterBandArray.push(childBand);
                    }
                }
                break;
            case 'BandDataFooter' : // 모든 데이터 출력이 끝난 후에 출력
                if (band.fixTitle == 'true') { // 데이터 헤더 밴드 고정 값이 '예'일 때
                    childFooterBandArray.push(childBand); // 매 페이지마다 나와야 함
                } else { // 데이터 헤더 밴드 고정 값이 '아니오'일 때
                    if (curDatarow > dt.length) { // 데이터 출력이 끝났을 때 나옴
                        childFooterBandArray.push(childBand);
                    }
                }
                break;
            case 'BandDummyFooter' :
                var isGroupFooter = false;
                childBands.forEach(function (childBand) {
                    if (childBand.attributes["xsi:type"] == 'BandGroupFooter') {
                        isGroupFooter = true;
                    }
                });
                if (isGroupFooter) { // 그룹 헤더가 있을 때는 그룹의 맨 마지막에 출력
                    if (!remainData) { // 출력할 그룹의 데이터가 남아있지 않을 때 O
                        childFooterBandArray.push(childBand);
                    }
                } else { // 그룹 헤더가 없을 때는 인쇄물의 마지막 페이지에만 출력
                    if (curDatarow > dt.length) { // 데이터 출력이 끝났을 때 나옴
                        childFooterBandArray.push(childBand);
                    }
                }
                break;
        }
    });
    drawBand(childFooterBandArray, layerName, reportHeight, band);
}

/***********************************************************
 기능 : 데이터 밴드의 자식 밴드의 출력 여부에 따라 길이를 구함
 만든이 : 구영준
 * *********************************************************/
function getChildBandHeight(band) {
    var childBandsHeight = 0;
    var childBands = band.childFooterBands;
    var dt = Object.values(dataTable.DataSetName)[0];

    childBands.forEach(function (childBand) {
        switch (childBand.attributes["xsi:type"]) {
            case 'BandGroupFooter' :
                if (!remainData) { // remaindata = false 남은 데이터가 없을 때
                    childBandsHeight += Number(childBand.rectangle.height);
                } else {
                    if (band.fixPriorGroupFooter == 'true') { //그룻 풋터 고정
                        childBandsHeight += Number(childBand.rectangle.height);
                    }
                }
                break;
            case 'BandDataFooter' : // 모든 데이터 출력이 끝난 후에 출력
                if (band.fixTitle == 'true') { // 데이터 헤더 밴드 고정 값이 '예'일 때
                    childBandsHeight += Number(childBand.rectangle.height);
                    // 매 페이지마다 나와야 함
                } else { // 데이터 헤더 밴드 고정 값이 '아니오'일 때
                    var lastPageDataCnt = $("#dynamicTable" + (pageNum - 1) + ' tr').length - 1;
                    if (curDatarow + lastPageDataCnt > dt.length) { // 데이터 출력이 끝났을 때 나옴
                        childBandsHeight += Number(childBand.rectangle.height);
                    }
                }
                break;
            case 'BandDummyFooter' :
                var isGroupFooter = false;
                childBands.forEach(function (childBand) {
                    if (childBand.attributes["xsi:type"] == 'BandGroupFooter') {
                        isGroupFooter = true;
                    }
                });
                if (isGroupFooter) { // 그룹 헤더가 있을 때는 그룹의 맨 마지막에 출력
                    if (!remainData) { // 출력할 그룹의 데이터가 남아있지 않을 때 O
                        childBandsHeight += Number(childBand.rectangle.height);
                    }
                } else { // 그룹 헤더가 없을 때는 인쇄물의 마지막 페이지에만 출력
                    var lastPageDataCnt = $("#dynamicTable" + (pageNum - 1) + ' tr').length - 1;

                    if (curDatarow + lastPageDataCnt > dt.length) { // 데이터 출력이 끝났을 때 나옴
                        childBandsHeight += Number(childBand.rectangle.height);
                    }
                }
                break;
        }
    });
    return childBandsHeight;
}
