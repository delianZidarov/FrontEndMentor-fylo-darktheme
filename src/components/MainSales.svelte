<style>
    section{
        text-align: center;   
    }
    h1{
        text-align: center;
        line-height: 1.5em;
        margin: 1rem;
        width: 81vw;
        
    }
    p{
        width: 79vw;
        margin: 1rem;
        text-align: center;
    }
    button{
       margin: 1rem;
       padding: 1rem 5rem;
     font-weight: 700;
    }
    
    .main-sales{
        display:flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--email-sign-up-bg);
        background-image: url("../images/bg-curvy-mobile.svg"), linear-gradient(var(--email-sign-up-bg) 0 60%, var(--main-bg-color) 60% 100%);
        background-repeat: no-repeat;
        background-position: center;
        margin-bottom: 120px;
    }
    .hero-image{
        width: 81vw;
        margin: 1.5rem;
    }
    .hero-image img{
        max-width: 100%;
    }
    @media screen and (min-width:1400px){
        h1{
            max-width: 45.9rem;
            font-size: 2.5rem;
            line-height: 3.75rem;
            margin-left: auto;
            margin-right: auto;
        }
       p{
           max-width: 36.8rem;
            font-size: 1.25rem;
            line-height: 1.875rem;
            margin-left: auto;
            margin-right: auto;
       }
       .main-sales{
          background-image: url("../images/bg-curvy-desktop.svg");
          background-position-y: 102.5%;
          padding-bottom: 12rem;
          margin-bottom: 0;
           
       } 
        .hero-image{
           margin-left: auto;
           margin-right: auto;
           width: auto;
        }
        
    }
</style>
<div class="main-sales">
<div class="hero-image">
    <img src="./images/illustration-intro.png" alt="giant folder with fills coming out"/>
</div>
<section>
<h1>All your files in one secure location, accessible anywhere.</h1>
<p> Fylo stores all your most important files in one secure location. Access them wherever 
  you need, share and collaborate with friends family, and co-workers.</p>
  <button class="btn">Get Started</button>
</section>
</div>