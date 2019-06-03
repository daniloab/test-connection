import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

const TableStyled = styled.table`
    width: 500px;  
    color: #333;
    border-collapse: collapse;
    font-size: 1.4rem;
      
    thead {    
        border-bottom: .1rem solid lightgray;
    }
    
    th {
      text-align: center;
      padding: .8rem;
    }

    tbody tr:nth-child(even) {
        background-color: #fff
      }
    
    tbody tr td {
        padding: 2rem;
    }

    tbody>tr:hover {
      background: lightblue;
      color: $black;
      font-weight: bold;
      cursor: pointer;
    }
    
    td {
      text-align: center;
    }
    
  } 
`;


const TableResults = ({ result, fetching, isLoading }) => {
    const [rowsResults, setRowsResults] = useState(null)
    const [finalResults, setFinalResults] = useState({})

    const renderRows = () => {
        const rows = () => result.map((r, i) => (
            <tr key={i}>
                <td>{i + 1}</td>
                <td>{r.code}</td>
                <td>{r.descr}</td>
            </tr>
        ));

        const resultOk = result.reduce((acc, cur) => {
            return cur.code === 100 ? acc + 1 : acc
        }, 0)

        const resultError = result.reduce((acc, cur) => {
            return cur.code === 99 ? acc + 1 : acc
        }, 0)

        const percentageOk = (resultOk / 100) * (resultOk + resultError);
        const percentageError = (resultError / 100) * (resultOk + resultError);

        setFinalResults({ ok: percentageOk, error: percentageError })

        setRowsResults(rows)
        isLoading();
    }

    if (!fetching) return (
        <>
            <div>
                <p>{finalResults.percentageOk}</p>
                <p>{finalResults.percentageCancel}</p>
            </div>
            <TableStyled>
                <thead>
                    <tr>
                        <th>Requisição</th>
                        <th>Código</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                <tbody>
                    {rowsResults}
                </tbody>
            </TableStyled>
        </>
    )

    renderRows()

    return <p>Carregando os resultados...</p>


};

export default TableResults;
