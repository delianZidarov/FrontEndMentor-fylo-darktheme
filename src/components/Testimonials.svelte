<style>
    p{
        font-size: .625rem;
        line-height: 1.125rem;
        margin-bottom: 1rem;
    }
    .testimonials-container{
        position:relative;
        display:flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        margin-left: calc(var(--body-margin) * 2);
        margin-right: calc(var(--body-margin) * 2);
    }
    .testimonial{
        padding: 1.5rem 1.25rem 1.3rem 1.25rem ;
        z-index: 1;
        border-radius: 4px;
        box-shadow: 0px 0px 8px 4px rgba(56, 56, 56, 0.0458843);
        background-color: var(--testimonials-bg);
    }
    .user-information-container{
        display: grid;
        grid-template-columns: 1.5rem auto;
        grid-template-rows: auto auto;
        gap: .5rem;
    }
    .user-description{
        font-size: .5em;
        line-height: .72em; 
    }
     h2{
        font-size: .625rem;
        line-height: .75rem;
    }
    .profile-pic{
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        grid-row:span 2;
    }
    .bg-quotes{
        position:absolute;
        width: 2rem;
        top:-22px;
        left:4px;
    }
    @media screen and (min-width:1400px){
        p{
            font-size: .875rem;
            line-height: 1.5em;
        }
        .testimonials-container{
            margin-left: 7.2rem;
            gap: 2.5rem;
        }
        .user-information-container{
            row-gap:0;
            column-gap: .75rem;
        }
        .testimonial{
            width: 22.5rem;
        }
        .user-description{
            font-size: .5rem;
            line-height: .625rem;
        }
        .bg-quotes{
        position:absolute;
        width: 5rem;
        top:-50px;
        left:-10px;
        }
    }
    @media screen and (min-width: 800px){
        .testimonials-container{
            margin-left: calc(10vw + 4px);
            margin-right: calc(10vw - 4px);
            width: 80vw;
        }
        .testimonial{
            width: 12rem;
        }
        .bg-quotes{
        position:absolute;
        width: 2rem;
        top:-22px;
        left:-4px;
    }
    }
</style>

<section class="testimonials-container">
    <img src="./images/bg-quotes.png" class="bg-quotes">
    <div class="testimonial">
        <p>  Fylo has improved our team productivity by an order of magnitude. Since making the switch our team has 
  become a well-oiled collaboration machine.</p>
        <div class="user-information-container">
            <img src="./images/profile-1.jpg" alt="Satish Pate" class="profile-pic"/>
            <h2> Satish Pate</h2>
            <p class="user-description"> Founder & CEO, Huddle</p>
        </div>
    </div>
    <div class="testimonial">
        <p>  Fylo has improved our team productivity by an order of magnitude. Since making the switch our team has 
  become a well-oiled collaboration machine.</p>
        <div class="user-information-container">
            <img src="./images/profile-2.jpg" alt="Bruce Mckenzie" class="profile-pic"/>
            <h2>Bruce McKenzie</h2>
            <p class="user-description">Founder & CEO, Huddle</p>
        </div>
    </div>
    <div class="testimonial">
        <p>  Fylo has improved our team productivity by an order of magnitude. Since making the switch our team has 
  become a well-oiled collaboration machine.</p>
        <div class="user-information-container">
            <img src="./images/profile-3.jpg" alt="Iva Boy" class="profile-pic"/>
            <h2>Iva Boy</h2>
            <p class="user-description">Founder & CEO, Huddle</p>
        </div>
    </div>
</section>