<script>
    let inputValue="";
    function correctEmailFormat (email){
        return email.length > 0? email.match(/[a-zA-Z0-9\.]+@[a-z]+\.[a-z]{2,3}/)? true:false: true;
    }
</script>
<style>
    
    p{
        text-align: center;
    }
    h2{
        font-size: 18px;
        line-height: 1.5rem;
    }
    form{
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        width: 83%;
        height: 78%;
    }
    input{
        width: var(--input-button-width);
        height: var(--input-button-height);
        border: none;
        border-radius: var(--input-button-border-radius);
        padding: var(--input-button-padding-top-bottom) var(--input-button-padding-left-right);
    }
    button{
        width: var(--input-button-width);
        height: var(--input-button-height);
        border-radius: var(--input-button-border-radius); 
        padding: var(--input-button-padding-top-bottom) var(--input-button-padding-left-right);
    }
    .signup-container{
        --input-button-width: 17.5rem;
        --input-button-height: 3rem;
        --input-button-padding-left-right: 1.75rem;
        --input-button-padding-top-bottom: 0;
        --input-button-border-radius: 1.5rem;
        display:flex;
        background-color: var(--email-sign-up-bg);
        width: 90vw;
        height: 53vh;
        margin-left: auto;
        margin-right: auto;
        align-items: center;
        justify-content: center;
        border-radius: 9px;
    }
    .error{
        position: relative;
        width: var(--input-button-width);
    }
    .error:after{
        position:absolute;
        content: "Error, please check your email";
        color: var(--error-color);
        font-size:.714em;
        font-weight: 700; 
        left: var(--input-button-padding-left-right);
        top:-1em;
    }
    ::placeholder{
        font-size: .714em;
        color: #c0c0c0;
    }

</style>
<div class="signup-container">
    <form>
<h2>Get Early access today</h2>
<p>It only takes a minute to sign up and our free starter tier is extremely generous. If you have any questions, our support team would be happy to help you.</p>
<input type="email" placeholder="email@example.com" bind:value={inputValue} class="error" required/>
<p class:error={!correctEmailFormat(inputValue)}></p>
<button>Get Started For Free</button>
    </form>
</div>