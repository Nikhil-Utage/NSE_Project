import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { useState } from 'react';
import axios from 'axios';

import { useEffect } from 'react';
import * as XLSX from 'xlsx';
import Buttons from './buttons';

const numericComparator = (valueA, valueB) => {
    const numA = parseFloat(valueA) || 0;
    const numB = parseFloat(valueB) || 0;
    return numA - numB;
};

const columns = [
    {
        headerName: 'Live Market',
        children: [
            { field: 'symbol', headerName: 'Symbol', width: 150, pinned: "left", comparator: numericComparator, cellDataType: 'numeric',cellStyle: params => params.value === 'Total' ? { fontWeight: 'bold' } : {}  },
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
            { field: 'open', headerName: 'Open', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'dayHigh', headerName: 'High', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'dayLow', headerName: 'Low', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'previousClose', headerName: 'Prev. Close', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'lastPrice', headerName: 'LTP', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'change', headerName: 'Chng', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'pChange', headerName: '%Chng', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'totalTradedVolume', headerName: 'Volume (shares)', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'totalTradedValue', headerName: 'Value (₹ crores)', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'yearHigh', headerName: '52W H', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'yearLow', headerName: '52W L', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'perChange30d', headerName: '30 D %CHNG', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'perChange365d', headerName: '365 D %CHNG', width: 150, comparator: numericComparator, cellDataType: 'numeric',  }
        ]
    },
    {
        headerName: 'Calculation',
        children: [
            {
                field: 'liveMarketCalculation',
                headerName: '(LTP-52W H)*100 /52W H [{H-M}*100/M]',
                width: 150 , comparator: numericComparator, cellDataType: 'numeric',
                valueFormatter: (params) => (params.value || 0)
            }
        ]
    },
    {
        headerName: 'Stock Futures',
        children: [
            { field: 'future1Buy', headerName: 'Order Book Buy Total Quantity', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'future1Sell', headerName: 'Order Book Sell Total Quantity', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'future1Cal', headerName: 'Sell / Buy ( AV/AU)', width: 150, comparator: numericComparator, cellDataType: 'numeric', valueFormatter: (params) => Number(params.value).toFixed(2) }
        ]
    },
    {
        headerName: 'Stock Futures 2',
        children: [
            { field: 'future2Buy', headerName: 'Order Book Buy Total Quantity 2', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'future2Sell', headerName: 'Order Book Sell Total Quantity 2', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'future2Cal', headerName: 'Sell / Buy ( AV/AU)', width: 150, comparator: numericComparator, cellDataType: 'numeric' }
        ]
    },
    {
        headerName: 'Stock Options',
        children: [
            { field: 'optionBuy', headerName: 'Order Book Buy Total Quantity', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'optionSell', headerName: 'Order Book Sell Total Quantity', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'optionType', headerName: 'Call / Put', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'optionPrice', headerName: 'Strike Price', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'optionCal', headerName: 'Sell / Buy ( AV/AU)', width: 150, comparator: numericComparator, cellDataType: 'numeric' }
        ]
    },
    {
        headerName: 'Trade Information',
        children: [
            { field: 'tradeOrderBookBuyQty', headerName: 'Order Book Buy Quantity', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'tradeOrderBookSellQty', headerName: 'Order Book Sell Quantity', width: 150, comparator: numericComparator, cellDataType: 'numeric' },
            { field: 'tradeRatio', headerName: 'Sell/Buy (BG/BF)', width: 150, comparator: numericComparator, cellDataType: 'numeric' }
        ]
    },
    {
        headerName: 'Total Buy/Total Sell',
        children:[
            {field: 'totalSellvsTotalBuy', headerName: "Total Sell/Total Buy", width: 150, comparator: numericComparator, cellDataType: 'numeric'}
        ]
    }
];





const DataComponent = ({Api}) => {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data,setData]=useState([])
 
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(Api);

            setData(response.data?.data)
            setLoading(false)
           

            const data = response?.data?.data?.map(item => ({
                _id: item._id ?? 0,
                symbol: item.symbol ?? '',
                chart: item.chart ?? '',
                open: (Number(item.open) || 0).toFixed(2),
                dayHigh: (Number(item.dayHigh) || 0).toFixed(2),
                dayLow: (Number(item.dayLow) || 0).toFixed(2),
                previousClose: (Number(item.previousClose) || 0).toFixed(2),
                lastPrice: (Number(item.lastPrice) || 0).toFixed(2),
                change: (Number(item.change) || 0).toFixed(2),
                pChange: (Number(item.pChange) || 0).toFixed(2),
                totalTradedVolume: (Number(item.totalTradedVolume) || 0).toFixed(2),
                totalTradedValue: (Number(item.totalTradedValue) || 0).toFixed(2),
                yearHigh: (Number(item.yearHigh) || 0).toFixed(2),
                yearLow: (Number(item.yearLow) || 0).toFixed(2),
                perChange30d: (Number(item.perChange30d) || 0).toFixed(2),
                perChange365d: (Number(item.perChange365d) || 0).toFixed(2),
                liveMarketCalculation: (Number(item.liveMarketCalculation || 0).toFixed(2)),
             
                tradeOrderBookBuyQty: (Number(item.tradeInfo?.orderBookBuyQty) || 0).toFixed(2),
                tradeOrderBookSellQty: (Number(item.tradeInfo?.ordrtBookSelQty) || 0).toFixed(2),
                tradeRatio: (Number(item.tradeInfo?.ratio) || 0).toFixed(2),
                tradeRatioRaw: (Number(item.tradeInfo?.ratio) || 0),
              

                future1Buy: (Number(item.derivativesData?.finalFuturesData?.[0]?.totalBuyQuantity) || 0).toFixed(2),
                future1Sell: (Number(item.derivativesData?.finalFuturesData?.[0]?.totalSellQuantity) || 0).toFixed(2),
                future1Cal: (Number(item.derivativesData?.finalFuturesData?.[0]?.calculated) || 0).toFixed(2),
                future1CalRaw: (Number(item.derivativesData?.finalFuturesData?.[0]?.calculated) || 0),
            
                future2Buy: (Number(item.derivativesData?.finalFuturesData?.[1]?.totalBuyQuantity) || 0).toFixed(2),
                future2Sell: (Number(item.derivativesData?.finalFuturesData?.[1]?.totalSellQuantity) || 0).toFixed(2),
                future2Cal: (Number(item.derivativesData?.finalFuturesData?.[1]?.calculated) || 0).toFixed(2),
                future2CalRaw: (Number(item.derivativesData?.finalFuturesData?.[1]?.calculated) || 0),
            
                // Options data
                optionBuy: (Number(item.derivativesData?.finalOptionsData?.totalBuyQuantity) || 0),
                optionSell: (Number(item.derivativesData?.finalOptionsData?.totalSellQuantity) || 0),
                optionType: item.derivativesData?.finalOptionsData?.optionType || '',
                optionPrice: (Number(item.derivativesData?.finalOptionsData?.strikePrice) || 0).toFixed(2),
                optionCal: (Number(item.derivativesData?.finalOptionsData?.calculated) || 0).toFixed(2),
                optionCalRaw: (Number(item.derivativesData?.finalOptionsData?.calculated) || 0),
                totalSellvsTotalBuy: (Number(item?.totalSellVsTotalBuy) || 0 ).toFixed(2),
                totalSellvsTotalBuyRaw: (Number(item?.totalSellVsTotalBuy) || 0 ),

    
            

              }));
              const totalOptionBuy = data.reduce((sum, row) => sum + row.future1CalRaw,0);
              const totalOptionSell = data.reduce((sum, row) => sum + row.future2CalRaw,0);
              const totalOptioncal = data.reduce((sum,row)=>sum + row.optionCalRaw, 0);
              const totalRatio = data.reduce((sum,row)=>sum + row.tradeRatioRaw, 0)
              const totalSellvsTotal = data.reduce((sum,row)=>sum + row.totalSellvsTotalBuyRaw, 0)
             
  
              // Add a totals row to the data
              data.push({
                  symbol: 'Total', 
                  future1Cal: totalOptionBuy,
                  future2Cal: totalOptionSell.toFixed(2),
                  optionCal: totalOptioncal.toFixed(2),
                  tradeRatio: totalRatio.toFixed(2),
                  totalSellvsTotalBuy : totalSellvsTotal.toFixed(2),

     
                  pinned: 'bottom' 
              });
              
              
              
            setRowData(data)
        };
        fetchData();
    }, [Api]);

    const handleDownloadExcel = () => {
        // Define the correct main headers (group headers) for each set of columns
        const repeat = (item, times) => Array(times).fill(item);

        const mainHeaders = [
            ...repeat('Live Market', 15),
            'Calculation',
            ...repeat('+Stock Futures', 2),
            'Calculation',
            ...repeat('+Stock Futures', 2),
            'Calculation',
            ...repeat('+Stock Options', 4),
            'Calculation',
            ...repeat('Trade Information', 3),
            'Total Buy/Total Sell'
            
           
        ];
    
        // Subheaders correspond to each column in your data grid
        const subHeaders = columns.flatMap(col => col.children.map(col => col.headerName));
        
        // Flatten all rows to prepare data for Excel
        const dataRows = data.map(row => [
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
            row.liveMarketCalculation || 0,
            row.derivativesData?.finalFuturesData?.[0]?.totalBuyQuantity || 0,
            row.derivativesData?.finalFuturesData?.[0]?.totalSellQuantity || 0,
            row.derivativesData?.finalFuturesData?.[0]?.calculated || 0,
            row.derivativesData?.finalFuturesData?.[1]?.totalBuyQuantity || 0,
            row.derivativesData?.finalFuturesData?.[1]?.totalSellQuantity || 0,
            row.derivativesData?.finalFuturesData?.[1]?.calculated || 0,
            row.derivativesData?.finalOptionsData?.totalBuyQuantity || 0,
            row.derivativesData?.finalOptionsData?.totalSellQuantity || 0,
            row.derivativesData?.finalOptionsData?.optionType || 'N/A',
            row.derivativesData?.finalOptionsData?.strikePrice || 0,
            row.derivativesData?.finalOptionsData?.calculated || 0,
            row.tradeInfo?.orderBookBuyQty || 0,
            row.tradeInfo?.ordrtBookSelQty || 0,
            row.tradeInfo?.ratio || 0,
            row?.totalSellvsTotalBuy || 0
           
            
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
            { s: { r: 0, c: 15 }, e: { r: 0, c: 15 } }, // 'Calculation' spanning 1 column
            { s: { r: 0, c: 16 }, e: { r: 0, c: 17 } }, // '+Stock Futures' spanning 2 columns
            { s: { r: 0, c: 18 }, e: { r: 0, c: 18 } }, // 'Calculation' spanning 2 columns
            { s: { r: 0, c: 19 }, e: { r: 0, c: 20 } }, // '+Stock Futures' spanning 2 columns
            { s: { r: 0, c: 21 }, e: { r: 0, c: 21 } }, // 'Calculation' spanning 1 columns
            { s: { r: 0, c: 22 }, e: { r: 0, c: 25 } }, // '+Stock Options' spanning 4 columns
            { s: { r: 0, c: 26 }, e: { r: 0, c: 26 } }, // 'Calculation' spanning 1 column
            { s: { r: 0, c: 27 }, e: { r: 0, c: 29 } }, // 'Trade Information' spanning 7 columns
            { s: { r: 0, c: 30 }, e: { r: 0, c: 30 } }, // 'Trade Information' spanning 7 columns
            
          
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
     <div className="ag-theme-alpine h-[60vh]">
     <div className='absolute z-10 right-0 top-0'>
    <Buttons handleDownloadExcel={handleDownloadExcel}/>
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
               
                pinnedTopRowData={columns.headerName} // For sticky headers
                pinnedBottomRowData={[]} // For sticky footers
                animateRows={true}
                alwaysShowHorizontalScroll={true}
                alwaysShowVerticalScroll={true}
             
               
                onGridReady={(params) => {
                    params.api.sizeColumnsToFit(); // Auto fit columns on grid ready
                    
                
                }}
            />
     </div>
   
              
        
        </>
  )
}

export default DataComponent