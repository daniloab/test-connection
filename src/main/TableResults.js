import React, { useState } from 'react';

import global from '../helpers/Global';
import styled, { css, keyframes } from 'styled-components';

const TableIsOpen = keyframes`
    0% {
        height: 0%;
    }
    100% {
        height: 100%;
    }
`

const TableClosed = css`
    display: none;
`

const TableOpen = css`
    width: 500px;
    display: block;
    animation: ${TableIsOpen} .5s linear;
`

const TableWrapper = styled.div`
    overflow: auto;
    ${props => props.isOpen ? TableOpen : TableClosed};
`

const TableStyled = styled.table`
    width: 100% 
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

const Head = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Results = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.4rem;
`

const ButtonDetails = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .81rem .7692rem;
    margin-left: .5rem;
    margin-right: .5rem;
    color: ${global.style.primaryColor};
    background: none;
    border: none;
    font-weight: bold;
    font-size: 1rem;
    text-transform: uppercase;
    transition: all 0.2s ease-in-out;

    &:hover {
        cursor: pointer;
        color: white;
        background: ${global.style.primaryColor};
      }
    }
`


const TableResults = ({ result, fetching }) => {
    const [rowsResults, setRowsResults] = useState(null)
    const [finalResults, setFinalResults] = useState({})
    const [isFetching, setIsFetching] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

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

        const percentageOk = (resultOk * 100) / (resultOk + resultError);
        const percentageError = (resultError * 100) / (resultOk + resultError);

        const resultObj = { ok: percentageOk, error: percentageError };

        setFinalResults(resultObj)

        setRowsResults(rows)
        setIsFetching(false);
    }

    if (!isFetching) return (
        <>
            <Head>
                <h1>Resultado</h1>
                <small>
                    <ButtonDetails onClick={() => setIsOpen(!isOpen)}>ver detalhes</ButtonDetails>
                    </small>
            </Head>

            <Results>
                <p>Pacotes enviados: {finalResults.ok}%</p>
                <p>Pacotes perdidos: {finalResults.error}%</p>
            </Results>
            <TableWrapper isOpen={isOpen}>
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
            </TableWrapper>
        </>
    )

    renderRows()

    return <p>Carregando os resultados...</p>


};

export default TableResults;
