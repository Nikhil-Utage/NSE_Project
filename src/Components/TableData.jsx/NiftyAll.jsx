import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import * as XLSX from 'xlsx';
import ApiConfig from '../Api/ApiConfig';
import Buttons from './buttons';

const NiftyAll = () => {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(ApiConfig.niftyAll);
                setRowData(response?.data?.data);
                setLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    const numericComparator = (valueA, valueB) => {
        const numA = parseFloat(valueA) || 0;
        const numB = parseFloat(valueB) || 0;
        return numA - numB;
    };
    const columns = [
        {
            headerName: 'Pre Open Market',
            children: [
                {
                    field: 'symbol',
                    headerName: 'Symbol',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    pinned: 'left'
                },
                {
                    field: 'chart',
                    headerName: 'Trading View Chart',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    pinned: 'left',
                    cellRenderer: (params) => (
                        <a
                            href={params.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'blue', textDecoration: 'underline' }}
                        >
                            View Chart
                        </a>
                    )
                },
                {
                    field: 'previousClose',
                    headerName: 'Prev. Close',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'iep',
                    headerName: 'IEP',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'change',
                    headerName: 'Chng',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'pChange',
                    headerName: '%Chng',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'lastPrice',
                    headerName: 'Final',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'finalQuantity',
                    headerName: 'Final Quantity',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'totalTurnover',
                    headerName: 'Value (₹)',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'yearHigh',
                    headerName: 'NM 52W H',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'yearLow',
                    headerName: 'NM 52W L',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
            ],
        },
        {
            headerName: 'Calculation',
            children: [
                {
                    field: 'calculated',
                    headerName: '(LTP-52W H)*100 /52W H   [{H-M}*100/M]',
                    width: 150 , comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2)
                }
            ]
        },
        {
            headerName: 'Pre Open Book',
            children: [
                {
                    field: 'totalBuyQuantity',
                    headerName: 'Total Buy Qty',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'totalSellQuantity',
                    headerName: 'Total Sell Qty',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
         
                {
                    field: 'sum4rowBuyQty',
                    headerName: 'Sum (4 Rows) Buy Qty',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'sum4rowSellQty',
                    headerName: 'Sum (4 Rows) Sell Qty',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'atoPrice',
                    headerName: 'ATO Price',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2)
                },
            ],
        },
        {
            headerName: 'Calculation',
            children: [
                {
                    field: 'calculatedData.totalBuyAnd4Buy',
                    headerName: 'Total Buy + Sum 4 Buy (O+Q)',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'calculatedData.totalSellAnd4Sell',
                    headerName: 'Total Sell + Sum 4 Sell (P+R)',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'calculatedData.totalBuyVsTotalSell',
                    headerName: 'Total Sell Qty / Total Buy Qty (N/M)',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'calculatedData.sum4SellVssum4Buy',
                    headerName: 'Sum Sell 4 Qty / Sum Buy 4 Qty (R/Q)',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'additionValue',
                    headerName: 'Added Value',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'subtractedValue',
                    headerName: 'Subtracted Value',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'calculatedData.totalSellAndSum4SellVstotalBuyAndSum4Buy',
                    headerName: 'Total sell + sum 4 sell / Total Buy + Sum 4 buy',
                    width: 150, comparator: numericComparator, cellDataType: 'numeric',
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                // {
                //     field: 'calculatedData.sCrossV',
                //     headerName: 'Value',
                //     width: 150, comparator: numericComparator, cellDataType: 'numeric',
                //     valueFormatter: (params) => (params.value || 0).toFixed(2),
                // },
            ],
        },
     
    ];
    const handleDownloadExcel = () => {
        // Define the correct main headers (group headers) for each set of columns

        const repeat = (item, times) => Array(times).fill(item);

        const mainHeaders = [
            ...repeat('Pre Open Market', 11),
            'Calculation',
            ...repeat('Pre Open Book',5),
            ...repeat('Calculation',7),
        ];

        // Define the subheaders corresponding to each field
      const subHeaders = columns.flatMap(col => col.children.map(col => col.headerName));


        // Manually map data for each row
        const dataRows = rowData.map(row => [
            row.symbol,
            row.chart,
            row.previousClose,
            row.iep,
            row.change,
            row.pChange,
            row.lastPrice,
            row.finalQuantity,
            row.totalTurnover,
            row.yearHigh,
            row.yearLow,
            row.calculated,
            row.totalBuyQuantity,
            row.totalSellQuantity,
            row.sum4rowBuyQty,
            row.sum4rowSellQty,
            row.atoPrice,
            row.calculatedData?.totalBuyAnd4Buy,
            row.calculatedData?.totalSellAnd4Sell,
            row.calculatedData?.totalBuyVsTotalSell,
            row.calculatedData?.sum4SellVssum4Buy,
            row.calculatedData?.aditionValue,
            row.calculatedData?.subtractValue,
            row.calculatedData?.totalSellAndSum4SellVstotalBuyAndSum4Buy,
        ]);

        // Prepare the worksheet data with grouped headers and subheaders
        const worksheetData = [
            mainHeaders,        // First row: main headers (groups)
            subHeaders,         // Second row: subheaders (column names)
            ...dataRows         // Data rows
        ];

        // Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        worksheet['!cols'] = Array(worksheetData[1].length).fill({ wch: 20 });

        // Define merge ranges for group headers (merging horizontally across subheaders)
        const mergeRanges = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }, // 'Pre Open Market' spanning 11 columns
            { s: { r: 0, c: 0 }, e: { r: 11, c: 11 } }, // 'Pre Open Market' spanning 11 columns
            { s: { r: 0, c: 12 }, e: { r: 0, c: 16 } }, // 'Pre Open Book' spanning 7 columns
            { s: { r: 0, c: 17 }, e: { r: 0, c: 23 } }, // 'Calculation' spanning 7 columns
            // 'Trade Information' spanning 7 columns
        ];

        // Add merge ranges to the worksheet
        if (!worksheet['!merges']) worksheet['!merges'] = [];
        worksheet['!merges'].push(...mergeRanges);

        // Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'NiftyAllData');

        // Download the Excel file
        XLSX.writeFile(workbook, 'NiftyAllData.xlsx');
    };
    

    return (
        <div className="ag-theme-alpine relative h-[60vh]   ">
            <h1 className='text-center text-4xl mb-8 font-bold tracking-widest'>Nifty All</h1>
                <div className='absolute right-0 z-10 top-0'>
                    <Buttons handleDownloadExcel={handleDownloadExcel} />
                </div>
            <AgGridReact
                rowData={rowData}
                columnDefs={columns}
                loadingOverlayComponentParams={{ loadingMessage: 'Loading data...' }}
                defaultColDef={{
                    resizable: true,
                    sortable: true,
                   
                }}
                alwaysShowHorizontalScroll={true}
                alwaysShowVerticalScroll={true}
               
               
                loading={loading ? true : false}
                pinnedTopRowData={columns.headerName} // For sticky headers
                pinnedBottomRowData={[]} // For sticky footers
                animateRows={true}
               
               
                onGridReady={(params) => {
                    params.api.sizeColumnsToFit(); // Auto fit columns on grid ready
                    
                
                }}
            />
        </div>
    );
};

export default NiftyAll;
