<script>
    import Fa from 'svelte-fa';
    import {faArrowRight} from "@fortawesome/free-solid-svg-icons"
</script>
<style>
    h2{
        font-size: 18px;
        text-align: center;
    }
    img{
        max-width: 100%;
    }
    p{
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
    a{ 
        text-decoration: none; 
        font-size: 12px;
        color: var(--accent-color); 
    }
    a:hover, a:focus{
        color:var(--accent-color);
        transition:none;
    }
    
    .productive-container{
        margin-top: 160px;
        margin-bottom: 160px;
        margin-left: var(--body-margin);
        margin-right: var(--body-margin);
    }
    .image-container{
        width: 81vw;
        margin-top: 46px;
        margin-bottom: 46px;
    }
    .link-container{
        display: inline-flex;
        padding-bottom: .25em;
        gap: 1ch;
        align-items:center;
        border-bottom: 1px solid var(--accent-color);
    }
  
   .link-container:hover {
    border-bottom: 1px solid var(--neutural-color);
    transition: 0.25s ease-in;
   }
    .link-container:hover  a{
    color:var(--neutural-color);
    font-weight: 700;
    transition: 0.25s ease-in;
   }
   .link-container:hover #change-bg{
    fill: var(--neutural-color);
    transition: 0.25s ease-in;
}
   #change-bg{
       fill: var(--accent-color);
   }
   @media screen and (min-width: 800px){
    h2{
        width: 20ch;
        text-align: left;
        font-size: 3.25rem;
    }
    p{
        width: 60ch;
        font-size: 1rem;
        line-height: 1.5rem;
    }
    a{
        font-size: 1rem;
    }
    .productive-container{
        display: flex;
        flex-wrap: nowrap;
        gap: 3.6rem;
        margin-left: 6.6rem;
    }
    .image-container{
        max-width:615px;
        flex-basis: 50%;
    }
    .productivity-description{
        flex-basis: 50%;
        margin-top: auto;
        margin-bottom: auto;
    }
   }
</style>
<section class="productive-container">
    <div class="image-container">
        <img src="./images/illustration-stay-productive.png" alt="people working together"/>
    </div>

    <div class="productivity-description">
        <h2>Stay productive, wherever you are</h2>
        <p>Never let location be an issue when accessing your files. Fylo has you covered for all of your file 
        storage needs.</p>
        <p> Securely share files and folders with friends, family and colleagues for live collaboration. No email 
        attachments required.</p>
        <div class="link-container">
            <a href="#" >See how Fylo works  </a> 
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle id="b" cx="6" cy="6" r="6"/><filter x="-25%" y="-25%" width="150%" height="150%" filterUnits="objectBoundingBox" id="a"><feOffset in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0.384313725 0 0 0 0 0.878431373 0 0 0 0 0.850980392 0 0 0 0.811141304 0" in="shadowBlurOuter1"/></filter></defs><g fill="none" fill-rule="evenodd"><g transform="translate(2 2)"><use fill="#000" filter="url(#a)" xlink:href="#b"/><use id="change-bg"  xlink:href="#b"/></g><path d="M8.582 6l-.363.35 1.452 1.4H5.333v.5h4.338L8.22 9.65l.363.35 2.074-2z" fill="#1B2330"/></g></svg>
        </div>
    </div>
</section>