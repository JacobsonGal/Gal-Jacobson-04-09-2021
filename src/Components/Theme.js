import { createGlobalStyle } from 'styled-components'

export const lightTheme = {
  body: '#f2f3f5',
  text: '#363537',
  //   background: '#f2f3f5',
  toggleBorder: '#FFF',
  gradient: 'linear-gradient(#39598A, #79D7ED)'
}

export const darkTheme = {
  body: '#1b1c1d!important',
  background:
    '#000 url(http://www.script-tutorials.com/demos/360/images/stars.png) repeat top center',
  text: '#FAFAFA',
  toggleBorder: '#6B8096',
  gradient: 'linear-gradient(#091236, #1E215D)'
}

export const GlobalStyles = createGlobalStyle`
    *,
    *::after,
    *::before {
        box-sizing: border-box;
    }

    body {
        min-width:460px;
        align-items: center;
        background: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.text};
        font-family: cursive;
        transition: all 0.25s linear;
    }

    .navBar {
        width: 100%;
        background-color: white;
        box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.15);
        .link{
            color: rgba(255, 255, 255, 0.55)
        }
        .navButton{
            color: rgba(255, 255, 255, 0.55)
        }
     
    }

    .spinner {
        position: fixed;
        top: 50%;
        left: 50%;
    }
    .link{
        text-decoration: none;
    }


    .day-card {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 1rem;
        width: 100%;
        height: 100%;
        box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.15);
        color: ${({ theme }) => theme.text};
        overflow: scroll;
        @media (max-width: 800px) {
            display: flex;
            flex-direction: column;
        }
        
    .card {
        min-width: 220px;
        min-height: 220px;
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        align-items: center;
        padding: 1rem;
        box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.15);
        border-radius: 15px;
        margin:5px;
        transition: all .7s ease-in-out; 
        &:hover { transform: scale(1.05); }
    }
  `
