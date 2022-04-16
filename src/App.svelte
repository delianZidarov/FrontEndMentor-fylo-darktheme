<script>
 import Navigation from "./components/Navigation.svelte"
 import Footer from "./components/Footer.svelte"
 import Signup from "./components/Signup.svelte"
</script>
<header>
<Navigation/>
</header>
<main>
	<Signup/>
</main>
<footer>
<Footer/>
</footer>
<style>
	 body{
		 background-color: var(--main-bg);
	 }
</style>