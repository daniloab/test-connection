import React, { useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { FaPlay, FaGlobeAmericas, FaDesktop, FaEllipsisH } from 'react-icons/fa'

import global from '../helpers/Global';

import TableResults from './TableResults'

const walking = keyframes`
    from {
      transform: translateX(0%);
      }
  
      to {
          transform: translateX(90%);
      }
  }
`

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }
    html {
        font-size: 62.5%
    }

    html,
    body,
    #root {        
        height: 100%;
    }

    body {    
        overflow-x: hidden;
        margin: 0;
        font-family: ${global.style.fontFamily} !important;
    }

    @media screen and (max-width: 1200px) {
        body {
            font-size: 12px;
        }
    }

    @media screen and (max-width: 960px) {
        body {
            font-size: 10px;
        }
    }
`;

const Container = styled.div`
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    position: relative;
    height: 100%;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100%;
`

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .81rem .7692rem;
    margin-left: .5rem;
    margin-right: .5rem;
    color: ${global.style.primaryColor};
    background: none;
    border: .6rem solid ${global.style.primaryColor};
    border-radius: 50%;
    font-weight: bold;
    font-size: 1.4rem;
    text-transform: uppercase;
    transition: all 0.2s ease-in-out;
    
    &:hover {
        cursor: pointer;
        color: white;
        background: ${global.style.primaryColor};
      }
    }

    svg {
        position: relative;
        left: 8%;
        top: 0.1em;
        line-height: .6;
        vertical-align: middle;
    }
`

const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const Loading = styled.div`
    position: relative;
    display: flex;
    padding-top: 4rem;
    width: 50rem;
`

const Ellipsis = styled.div`
    display: flex;
    align-items: center;    
    width: 100%;
    height: 4rem;
    animation: ${walking} 1.5s linear infinite;
`

const Icons = styled.div`
    position: absolute;
    display: flex;
    justify-content: space-between;
    width: 100%;
    
    svg {
      background: white;
    }
  }
`

const Loader = () => (
    <LoadingWrapper>
        <Loading>
            <Ellipsis>
                <FaEllipsisH size={30} />
            </Ellipsis>
            <Icons>
                <FaDesktop size={40} />
                <FaGlobeAmericas size={40} />
            </Icons>
        </Loading>
    </LoadingWrapper>
)

function timeoutPromise(ms, promise) {
    return new Promise((resolve, reject) => {
      let timeoutId = setTimeout(() => {
        timeoutId = undefined;
        reject(new Error("promise timeout"))
      }, ms);
      promise.then(
        (res) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
            resolve(res);
          }
        },
        (err) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
            reject(err);
          }
        }
      );
    })
  }

const App = () => {
    const [results, setResults] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const startTest = async (loop) => {
        setIsFetching(true);

        var reqs = [];
        for (let i = 1; i <= loop; i++) {
            try {
                const response = await timeoutPromise(15000, fetch(`${global.api}`), {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    method: 'GET'
                });

                const req = await response;
                reqs.push({code: 100, descr: ` ${req.status} ${req.statusText}`});
            } catch (error) {
                reqs.push({code: 99, descr: `${error}`})
            }
        }

        setResults(reqs);        
        setIsFetching(false);
    }

    return (
        <>
            <GlobalStyle />
            <Container>
                <Wrapper>
                    {isFetching && <Loader />}

                    {
                        results.length === 0 && isFetching === false &&
                        <>
                            <h1>Testar Conexão</h1>
                            <Button onClick={() => startTest(10)}>
                                <FaPlay size={40} />
                            </Button>
                        </>
                    }

                    {
                        results.length > 0 && !isFetching &&
                        <>
                            <TableResults result={results} />
                        </>
                    }
                </Wrapper>
            </Container>
        </>
    )
};

export default App;
