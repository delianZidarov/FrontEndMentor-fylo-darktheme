<script>
  import Fa from 'svelte-fa'
  import { faFacebookF} from '@fortawesome/free-brands-svg-icons'
  import {faTwitter} from '@fortawesome/free-brands-svg-icons'
  import { faInstagram} from '@fortawesome/free-brands-svg-icons'
</script>
<style>
    a{  
        color: inherit;
        text-decoration: none;
    }
    a:visited{
        color: inherit;
       
    }
    
    .footer{
        padding-left: 1.75rem;
        padding-bottom: 3.5rem;
        
        background-color: var(--footer-bg);
    }
    .container {
        margin-top: 2.25rem;
        display: grid;
        grid-template-columns: 1.5rem 1fr;
        grid-template-rows: auto auto auto;
        gap: 1rem;
    }
    .footer-logo{
        height: 2rem;
        transform: translateX(11px);
    }
    .footer-logo img{
        max-height: 100%;
    }
    .container img{
        max-height: 1.5rem;
        width: auto;
    }
    .address{
        transform: translateY(5px);
    }
    .email{
        transform: translateY(2px);
    }
    .phone{
        height: 14px;
    }
    .links-container{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 3.5rem;
        margin-bottom: 3.5 rem;
        font-size: 1rem;
        font-family: var(--font-family-body);
    }
    .social-media-container{
        display:flex;
        gap: 10px;
        justify-content: center;
        margin-top: 3.5rem;
    }
    .social-icon{
        display: flex;
        justify-content: center;
        align-items: center;
        width:  1.7rem;
        height: 1.7rem;
        border: .8px solid #dfe4f0;
        border-radius: 50%;
    }
    .social-icon a{
        font-size: 14px;
    }
    .social-icon:hover , .social-icon:focus{
        color: var(--accent-color);
        border-color: var(--accent-color);
        transition: 0.25s ease-in;
    }
    @media screen and (min-width: 1400px){
        .footer{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 52px;
            width: 86vw;
            margin-left: auto;
            margin-right:auto;
        }
        .footer-logo{
            flex-basis: 100%;
        }
        .container{
            grid-template: "locationImg location phoneImg phone" 2.25rem
                            "locationImg location emailImg email" 2.25rem / 1.5rem 3fr 1.5rem 2fr;
            width: 630px;
            margin-top:0;
            margin-left: 12px;
        }
        .address{
            grid-area: locationImg;
        }
        .address + p{
            grid-area: location;
        }
        .links-container{
            margin-top: 0;
        }
        .social-media-container{
            margin-top: 0;
        }
    }
</style>
<div class="footer">
<div class="footer-logo">
    <img src="./images/logo.svg" alt="Fylo"/> 
</div>
<section class="container">
        <img src="./images/icon-location.svg" alt="Address" class="address">  
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
  dolore magna aliqua</p>
  
        <img src="./images/icon-phone.svg" alt="Phone" class="phone">
            <p>+1-543-123-4567</p>
        <img src="./images/icon-email.svg" alt="Email" class="email">
            <p>example@fylo.com</p>
</section>
<section class="links-container">
  <a>About Us</a>
  <a>Jobs</a>
  <a>Press</a>
  <a>Blog</a>
</section>
<section class="links-container">
  <a>Contact Us</a>
  <a>Terms</a>
  <a>Privacy</a>
</section>
<section class="social-media-container">
    <div class="social-icon">
    <a href="" aria-label="facebook"><Fa icon={faFacebookF} aria-hidden="true"/></a>
    </div>
    <div class="social-icon">
    <a href="" aria-label="twitter"><Fa icon={faTwitter} aria-hidden="true"/></a>
    </div>
    <div class="social-icon">
    <a href="" aria-label="instagram"><Fa icon={faInstagram} aria-hidden="true"/></a>
    </div>
<section>
</div>