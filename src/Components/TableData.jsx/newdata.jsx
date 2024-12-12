import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import * as XLSX from 'xlsx';
import ApiConfig from '../Api/ApiConfig';
import Buttons from './buttons';

const MyAgGrid = () => {
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

    const columns = [
        {
            headerName: 'Pre Open Market',
            children: [
                {
                    field: 'symbol',
                    headerName: 'Symbol',
                    width: 150,
                    pinned: 'left'
                },
                {
                    field: 'chart',
                    headerName: 'Trading View Chart',
                    width: 150,
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
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'iep',
                    headerName: 'IEP',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'change',
                    headerName: 'Chng',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'pChange',
                    headerName: '%Chng',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'lastPrice',
                    headerName: 'Final',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'finalQuantity',
                    headerName: 'Final Quantity',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'totalTurnover',
                    headerName: 'Value (₹)',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'yearHigh',
                    headerName: 'NM 52W H',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'yearLow',
                    headerName: 'NM 52W L',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
            ],
        },
        {
            headerName: 'Pre Open Book',
            children: [
                {
                    field: 'totalBuyQuantity',
                    headerName: 'Total Buy Qty',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'totalSellQuantity',
                    headerName: 'Total Sell Qty',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'atoBuyQty',
                    headerName: 'ATO Buy Qty',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'atoSellQty',
                    headerName: 'ATO Sell Qty',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'sum4rowBuyQty',
                    headerName: 'Sum (4 Rows) Buy Qty',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'sum4rowSellQty',
                    headerName: 'Sum (4 Rows) Sell Qty',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'atoPrice',
                    headerName: 'ATO Price',
                    width: 150,
                    valueFormatter: (params) => (
                        <span style={{ color: 'darkgreen' }}>{(params.value || 0).toFixed(2)}</span>
                    ),
                },
            ],
        },
        {
            headerName: 'Calculation',
            children: [
                {
                    field: 'calculatedData.atoBuyAnd4Buy',
                    headerName: 'ATO Buy + Sum 4 Buy (O+Q)',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'calculatedData.atoSellAnd4Sell',
                    headerName: 'ATO Sell + Sum 4 Sell (P+R)',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'calculatedData.totalBuyVsTotalSell',
                    headerName: 'Total Sell Qty / Total Buy Qty (N/M)',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'calculatedData.sum4SellVssum4Buy',
                    headerName: 'Sum Sell 4 Qty / Sum Buy 4 Qty (R/Q)',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'calculatedData.atoSellVsAtoBuy',
                    headerName: 'ATO Sell Qty / ATO Buy Qty (P/O)',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'calculatedData.uVsT',
                    headerName: 'Ato sell + sum 4 sell / Ato Buy + Sum 4 buy',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'calculatedData.sCrossV',
                    headerName: 'Value',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
            ],
        },
        {
            headerName: 'Trade Information',
            children: [
                {
                    field: 'tradeInfo.orderBookBuyQty',
                    headerName: 'Order Book Buy Qty',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'tradeInfo.ordrtBookSelQty',
                    headerName: 'Order Book Sell Qty',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'tradeInfo.ratio',
                    headerName: 'Ratio (AG/AF)',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'tradeInfo.totalMarketCap',
                    headerName: 'Total Market Cap (₹)',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'tradeInfo.deliverableVsTradedQty',
                    headerName: '% of Deliverable / Trade Quantity',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
                {
                    field: 'tradeInfo.dailyVolatility',
                    headerName: 'Daily Volatility',
                    width: 150,
                    valueFormatter: (params) => (params.value || 0).toFixed(2),
                },
            ],
        },
    ];
    const handleDownloadExcel = () => {
        // Define the correct main headers (group headers) for each set of columns
        const mainHeaders = [
            'Pre Open Market', 'Pre Open Market', 'Pre Open Market', 'Pre Open Market', 'Pre Open Market', 'Pre Open Market', 'Pre Open Market', 'Pre Open Market', 'Pre Open Market', 'Pre Open Market', 'Pre Open Market',
            'Pre Open Book', 'Pre Open Book', 'Pre Open Book', 'Pre Open Book', 'Pre Open Book', 'Pre Open Book',
            'Calculation', 'Calculation', 'Calculation', 'Calculation', 'Calculation', 'Calculation',
            'Trade Information', 'Trade Information', 'Trade Information', 'Trade Information', 'Trade Information', 'Trade Information', 'Trade Information'
        ];

        // Define the subheaders corresponding to each field
        const subHeaders = [
            'Symbol', 'Trading View Chart', 'Prev. Close', 'IEP', 'Chng', '%Chng', 'Final', 'Final Quantity', 'Value (₹)', 'NM 52W H', 'NM 52W L',
            'Total Buy Qty', 'Total Sell Qty', 'ATO Buy Qty', 'ATO Sell Qty', 'Sum (4 Rows) Buy Qty', 'Sum (4 Rows) Sell Qty', 'ATO Price',
            'ATO Buy + Sum 4 Buy (O+Q)', 'ATO Sell + Sum 4 Sell (P+R)', 'Total Sell Qty / Total Buy Qty (N/M)', 'Sum Sell 4 Qty / Sum Buy 4 Qty (R/Q)',
            'ATO Sell Qty / ATO Buy Qty (P/O)', 'Ato sell + sum 4 sell / Ato Buy + Sum 4 buy', 'Value',
            'Order Book Buy Qty', 'Order Book Sell Qty', 'Ratio (AG/AF)', 'Total Market Cap (₹)', '% of Deliverable / Trade Quantity', 'Daily Volatility', 'Annualised Volatility'
        ]


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
            row.totalBuyQuantity,
            row.totalSellQuantity,
            row.atoBuyQty,
            row.atoSellQty,
            row.sum4rowBuyQty,
            row.sum4rowSellQty,
            row.atoPrice,
            row.calculatedData?.atoBuyAnd4Buy,
            row.calculatedData?.atoSellAnd4Sell,
            row.calculatedData?.totalBuyVsTotalSell,
            row.calculatedData?.sum4SellVssum4Buy,
            row.calculatedData?.atoSellVsAtoBuy,
            row.calculatedData?.uVsT,
            row.calculatedData?.sCrossV,
            row.tradeInfo?.orderBookBuyQty,
            row.tradeInfo?.ordrtBookSelQty,
            row.tradeInfo?.ratio,
            row.tradeInfo?.totalMarketCap,
            row.tradeInfo?.deliverableVsTradedQty,
            row.tradeInfo?.dailyVolatility,
            row.tradeInfo?.annualisedVolatility
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
            { s: { r: 0, c: 11 }, e: { r: 0, c: 17 } }, // 'Pre Open Book' spanning 7 columns
            { s: { r: 0, c: 18 }, e: { r: 0, c: 24 } }, // 'Calculation' spanning 7 columns
            { s: { r: 0, c: 25 }, e: { r: 0, c: 31 } }, // 'Trade Information' spanning 7 columns
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
        <div className="ag-theme-alpine relative" style={{ height: 800, width: '100%' }}>
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
                style={{ height: '400px', width: '100%' }} 
                pinnedTopRowData={columns.headerName} // For sticky headers
                pinnedBottomRowData={[]} // For sticky footers
                animateRows={true}
                pagination={true}
                paginationPageSize={100}
               
                onGridReady={(params) => {
                    params.api.sizeColumnsToFit(); // Auto fit columns on grid ready
                    
                
                }}
            />
        </div>
    );
};

export default MyAgGrid;
