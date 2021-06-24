const email = document.querySelector('.email');
const password = document.querySelector('.password');
const submit = document.querySelector('.submit');
const form = document.querySelector('.form');
const feedback = document.querySelector('.feedback');

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const body = {
        email: email.value,
        password: password.value
    }

    fetch('https://secret-plains-53369.herokuapp.com/api/v1/admin-login', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(res => res.json())
            .then(res => {
                if(res.status === 'success') {
                   window.location = './yourDashboard.html'

                   return localStorage.setItem('token', res.token)

                }
                
                feedback.textContent = res.message;
            })
            .catch(e => console.error(e))
})