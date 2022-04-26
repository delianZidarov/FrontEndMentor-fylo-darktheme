<script>
 import Navigation from "./components/Navigation.svelte"
 import Footer from "./components/Footer.svelte"
 import Signup from "./components/Signup.svelte"
 import MainSales from "./components/MainSales.svelte"
 import SalesPoints from "./components/SalesPoints.svelte"
 import Productive from "./components/Productive.svelte"
 import Testimonials from "./components/Testimonials.svelte"
</script>
<style>
	header{
	background-color: var(--email-sign-up-bg);
	}
	main{
		position:relative;
		padding-bottom: 337px;
		
	}
	footer{
		background-color: var(--footer-bg);
		padding-top: 259px;
	}
	.position-sign-up{
		position:absolute;
		bottom:-26.5vh;
		left:0;
		right:0;
	}
	@media screen and (min-width: 800px){
		.position-sign-up{
			bottom: -11rem;
		}
	}
	@media screen and (min-width: 1400px){
		footer{
			padding-top: 12.75rem;
		}
		.position-sign-up{
			bottom: -8.75rem;
		}
	}
	
</style>
<header>
<Navigation/>
</header>
<main>
	<MainSales/>
	<SalesPoints/>
	<Productive/>
	<Testimonials/>
	<div class="position-sign-up">
	<Signup/>
	</div>
</main>
<footer>
<Footer/>
</footer>
