$(window).unload(function () {
    prefs.data = {
        scol: $('#dataGrid').jqGrid('getGridParam', 'sortname'),
        sord: $('#dataGrid').jqGrid('getGridParam', 'sortorder'),
        page: $('#dataGrid').jqGrid('getGridParam', 'page')
    };
    prefs.save();
});

$(document).ready(function () {
    $(document).ready(function () {
        var gridprefs = prefs.load();
        $("#dataGrid").jqGrid({
            url: './getData',
            mtype: "GET",
            datatype: "json",
            colModel: [
                {
                    label: 'Negative/Positive numbers',
                    name: 'negativeNumbers',
                    width: 170,
                    key: true,
                    formatter: formatRating
                },
                {
                    label: 'Links',
                    name: 'links',
                    width: 150,
                    formatter: 'link'
                },
                {
                    label: 'Float',
                    name: 'floatNumbers',
                    width: 100,
                    formatter: 'integer',
                    formatoptions: {decimalSeparator: ".", decimalPlaces: 3, thousandsSeparator: " "}
                },
                {
                    label: 'Integer',
                    name: 'integerNumbers',
                    width: 80
                },
                {
                    label: 'Boolean',
                    name: 'booleanNumbers',
                    width: 90,
                    formatter: 'checkbox',
                    sortable: false
                }
            ],
            page: 1,
            width: 780,
            height: 250,
            rowNum: 20,
            scrollPopUp: true,
            scrollLeftOffset: "83%",
            viewrecords: true,
            emptyrecords: 'Scroll to bottom to retrieve new page', // the message will be displayed at the bottom
            pager: "#dataGridPager",
            sortable: true,
            scroll: 1, // set the scroll property to 1 to enable paging with scrollbar - virtual loading of records
            sortname: gridprefs.scol,
            sortorder: gridprefs.sord,
            page: gridprefs.page
        });
    });

    function formatRating(cellValue, options, rowObject) {
        var color = (parseInt(cellValue) > 0) ? "blue" : "red";
        var cellHtml = "<span style='color:" + color + "' originalValue='" +
            cellValue + "'>" + cellValue + "</span>";
        return cellHtml;
    }
});
