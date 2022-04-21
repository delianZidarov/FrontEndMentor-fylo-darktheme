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
        gap: 1ch;
        align-items:center;
        border-bottom: 1px solid var(--accent-color);
    }
   .icon-arrow{
       display: inline-block;
       background-image: url("../images/icon-arrow.svg");
       width: 1rem;
       height: 1rem;
   } 
   .link-container:hover {
    border-bottom: 1px solid var(--neutural-color);
   }
    .link-container:hover  a{
    color:var(--neutural-color);
    font-weight: 700;
   }
   .link-container:hover .icon-arrow{
       background-image: url("../images/icon-arrow-white.svg");
   }
</style>
<section class="productive-container">
<div class="image-container">
<img src="./images/illustration-stay-productive.png" alt="people working together"/>
</div>
<h2>Stay productive, wherever you are</h2>
<p>Never let location be an issue when accessing your files. Fylo has you covered for all of your file 
  storage needs.</p>
<p> Securely share files and folders with friends, family and colleagues for live collaboration. No email 
  attachments required.</p>
  <div class="link-container">
<a href="#" >See how Fylo works  </a> 
<span class="icon-arrow"></span>
  </div>
</section>