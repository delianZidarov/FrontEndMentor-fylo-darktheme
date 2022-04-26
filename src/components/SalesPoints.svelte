<style>
    img{
        margin-bottom: 1.5rem;
    }
    h2{
        font-size: 18px;
        line-height: 1.5rem;
    }
    p{
        margin: .5rem 0;
    }
    .sales-points-container{
        display: flex;
        flex-wrap: wrap;
        background-color: var(--main-bg-color);
        gap: 5.6rem;
        margin: 60px var(--body-margin) 60px var(--body-margin);
    }
    .sales-point{
        text-align: center;
    }
    @media screen and (min-width: 1400px){
        h2{
            font-size: 1.25rem;
        }

        .sales-points-container{
            margin-left: auto;
            margin-right: auto;
            padding-top:0;
            margin-top:0;
            width: 61vw;
        }
        .sales-point{
            width: 23.5rem;
        }
    }
</style>
<section class="sales-points-container">
    <div class="sales-point">
        <img src="./images/icon-access-anywhere.svg" alt=""/>
        <h2>Access your files, anywhere</h2>
        <p>The ability to use a smartphone, tablet, or computer to access your account means your 
  files follow you everywhere.</p>
    </div>
    <div class="sales-point">
        <img src="./images/icon-security.svg" alt=""/>
        <h2>Security you can trust</h2>
        <p>2-factor authentication and user-controlled encryption are just a couple of the security 
  features we allow to help secure your files.</p>
    </div>
    <div class="sales-point">
        <img src="./images/icon-collaboration.svg" alt=""/>
        <h2>Real-time collaboration</h2>
        <p>Securely share files and folders with friends, family and colleagues for live collaboration. 
  No email attachments required.</p>
    </div>
     <div class="sales-point">
        <img src="./images/icon-any-file.svg" alt=""/>
        <h2>Store any type of file</h2>
        <p>Whether you're sharing holidays photos or work documents, Fylo has you covered allowing for all 
  file types to be securely stored and shared.</p>
    </div>
</section>