import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import * as XLSX from 'xlsx';
import ApiConfig from '../Api/ApiConfig';
import Buttons from './buttons';

const numericComparator = (valueA, valueB) => {
    const numA = parseFloat(valueA) || 0;
    const numB = parseFloat(valueB) || 0;
    return numA - numB;
}
const columns = [
    {
        headerName: 'Live Market',
        children: [
            { field: 'symbol', headerName: 'Symbol', width: 150, pinned: "left" ,comparator: numericComparator, cellDataType: 'numeric', },
            {
                field: 'chart', headerName: 'Trading View Chart', width: 150, pinned: "left", comparator: numericComparator, cellDataType: 'numeric',
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
            { field: 'open', headerName: 'Open', width: 150,comparator: numericComparator, cellDataType: 'numeric', },
            { field: 'dayHigh', headerName: 'High', width: 150, comparator: numericComparator, cellDataType: 'numeric', },
            { field: 'dayLow', headerName: 'Low', width: 150, comparator: numericComparator, cellDataType: 'numeric', },
            { field: 'previousClose', headerName: 'Prev. Close', width: 150, comparator: numericComparator, cellDataType: 'numeric', },
            { field: 'lastPrice', headerName: 'LTP', width: 150, comparator: numericComparator, cellDataType: 'numeric', },
            { field: 'change', headerName: 'Chng', width: 150, comparator: numericComparator, cellDataType: 'numeric', },
            { field: 'pChange', headerName: '%Chng', width: 150, comparator: numericComparator, cellDataType: 'numeric', },
            { field: 'totalTradedVolume', headerName: 'Volume (shares)', width: 150, comparator: numericComparator, cellDataType: 'numeric', },
            { field: 'totalTradedValue', headerName: 'Value (₹ crores)', width: 150, comparator: numericComparator, cellDataType: 'numeric', },
            { field: 'yearHigh', headerName: '52W H', width: 150, comparator: numericComparator, cellDataType: 'numeric', },
            { field: 'yearLow', headerName: '52W L', width: 150, comparator: numericComparator, cellDataType: 'numeric', },
            { field: 'perChange30d', headerName: '30 D %CHNG', width: 150, comparator: numericComparator, cellDataType: 'numeric', },
            { field: 'perChange365d', headerName: '365 D %CHNG', width: 150, comparator: numericComparator, cellDataType: 'numeric', }
        ]
    },
    {
        headerName: 'Calculation',
        children: [
            {
                field: 'liveMarketCalculation',
                headerName: '(LTP-52W H)*100 /52W H   [{H-M}*100/M]',
                width: 150 , comparator: numericComparator, cellDataType: 'numeric',
                valueFormatter: (params) => (params.value || 0).toFixed(2)
            }
        ]
    },

    {
        headerName: 'Trade Information',
        children: [
            { field: 'tradeInfo.orderBookBuyQty', headerName: 'Order Book Buy Quantity', width: 150, comparator: numericComparator, cellDataType: 'numeric', valueFormatter: (params) => (params.value || 0).toFixed(2), },
            { field: 'tradeInfo.ordrtBookSelQty', headerName: 'Order Book Sell Quantity', width: 150 , comparator: numericComparator, cellDataType: 'numeric', valueFormatter: (params) => (params.value || 0).toFixed(2),},
            { field: 'tradeInfo.ratio', headerName: 'Sell/Buy Ratio', width: 150, comparator: numericComparator, cellDataType: 'numeric', valueFormatter: (params) => (params.value || 0).toFixed(2), },
           
        ]
    }
];









const Nifty500 = () => {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchData = async ()=>{
        
        try{
            const response = await axios.get(ApiConfig.nifty500);
            setRowData(response?.data?.data)
            setLoading(false)
        }
        catch{
            console.log("Error fetching data")
        }
      

      }
      fetchData()
  

    
    
    }, [])



    
    
    
    const handleDownloadExcel = () => {
        // Define the correct main headers (group headers) for each set of columns
        const repeat = (item, times) => Array(times).fill(item);

        const mainHeaders = [
            ...repeat('Live Market', 15),
            'Calculation',
            ...repeat('Trade Information', 3),
        ];
    
        // Subheaders correspond to each column in your data grid
        const subHeaders = columns.flatMap(col => col.children.map(head => head.headerName));
        
        // Flatten all rows to prepare data for Excel
        const dataRows = rowData.map(row => [
            row.symbol,
            row.chart,
            row.open || 0,
            row.dayHigh || 0,
            row.dayLow || 0,
            row.previousClose || 0,
            row.lastPrice || 0,
            row.change || 0,
            row.pChange || 0,
            row.totalTradedVolume || 0,
            row.totalTradedValue || 0,
            row.yearHigh || 0,
            row.yearLow || 0,
            row.perChange30d || 0,
            row.perChange365d || 0,
            row.liveMarketCalculation,
            row.tradeInfo?.orderBookBuyQty || 0,
            row.tradeInfo?.ordrtBookSelQty || 0,
            row.tradeInfo?.ratio || 0,

        ]);
        
        
        // Prepare the worksheet data with grouped headers and subheaders
        const worksheetData = [
            mainHeaders,        // First row: main headers (groups)
            subHeaders,         // Second row: subheaders (column names)
            ...dataRows
        ];
    
        // Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);


        worksheet['!cols'] = Array(worksheetData[1].length).fill({ wch: 20 });
        
        // Define the correct merge ranges for group headers (merging horizontally across subheaders)
        const mergeRanges = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } },  // 'Live Market' spanning 15 columns
            { s: { r: 0, c: 15 }, e: { r: 0, c: 15 } },  // 'Live Market' spanning 15 columns
            { s: { r: 0, c: 16 }, e: { r: 0, c: 18 } }, // 'Trade Information' spanning 9 columns
           
        ];
    
        // Apply merges to worksheet
        if (!worksheet['!merges']) worksheet['!merges'] = [];
        worksheet['!merges'].push(...mergeRanges);
    
        // Create workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Market Data');
    
        // Export the workbook to Excel
        XLSX.writeFile(workbook, 'Market_Data.xlsx');
    };
    return (
        <>
       <div className="ag-theme-alpine relative h-[60vh]">
            <h1 className='text-center text-4xl mb-8 font-bold tracking-widest'>Nifty 500</h1>
                <div className='absolute right-0 z-10 top-0'>
                    <Buttons handleDownloadExcel={handleDownloadExcel} />
                </div>
            <AgGridReact
                rowData={rowData}
                columnDefs={columns}
                loadingOverlayComponentParams={{ loadingMessage: 'Loading data...' }}
                loading={loading ? true : false}
                defaultColDef={{
                    resizable: true,
                    sortable: true,
                }}
                alwaysShowHorizontalScroll={true}
                alwaysShowVerticalScroll={true}
        
                
               
                pinnedTopRowData={columns.headerName} // For sticky headers
                pinnedBottomRowData={[]} // For sticky footers
                animateRows={true}
              
               
                onGridReady={(params) => {
                    params.api.sizeColumnsToFit(); // Auto fit columns on grid ready
                    
                
                }}
            />
        </div>
        
        </>
       
    );
};

export default Nifty500;
