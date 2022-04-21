
<style>
    nav{
        flex-basis: 50%;
    }
    ul{
        display: flex;
        gap: 1.5rem;
        list-style:none;
        font-size: 12px;
        font-family: var(--font-family-heading);
    
    }
    a, a:visited{
        text-decoration: none;
        color: var(--neutural-color);
    }
    a:hover, a:focus{
        text-decoration: underline;
    }
    img{
        object-fit: contain;
        max-height:100%;
    }
    .top-banner{
        display: flex;
        align-items: center;
        background-color: var(--email-sign-up-bg);
        width: 88vw;
        padding: 1.5rem 0 1.5rem 0;
        
        margin: 0 auto 0 auto; 
        transform: translateX(-4px);
    }
    .logo{
        flex-basis: 50%;
        height: 1.5rem;
    }
</style>

<div class="top-banner">
<div class="logo" >
    <a href="#" aria-label="home" ><img src="./images/logo.svg"/></a>
</div>
<nav>
<ul> 
    <li ><a href="#" >Features</a></li>
    <li ><a href="#" >Team</a></li>
    <li ><a href="#" >Sign In</a></li>   
</ul>
</nav>
</div>
