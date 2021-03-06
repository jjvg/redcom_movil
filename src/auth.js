import router from './router'
import axios from 'axios'
import decode from 'jwt-decode';
// URL and endpoint constants
const API_URL = 'http://localhost:8000/'
const LOGIN_URL = API_URL + 'api-token-auth/'
const SIGNUP_URL = API_URL + 'rest-auth/registration/'
const GETUSER_URL = API_URL + 'api/user/?format=json'
const POST_URL = API_URL + 'api/publicacion/'
    //axios.defaults.headers.post['Content-Type'] = 'application/json';
export default {

    //Objeto usuario que se instancia en el sistema

    user: {
        id: '',
        _cls: '',
        email: '',
        slug: '',
        name: '',
        password: '',
        estado: '',
        ciudad: '',
        direccion: '',
        apellido: '',
        intereses: Array,
        genero: 0,
        edad: 0,
        telefono_contacto: 0,
        a_intereses: Array,
        telefono: 0,
        responsable: '',
        area_dedicada: '',
        seguidores: Array,
        seguidos: Array,
        notificaciones: Array,
        modificado: { type: Date },
        activo: true,
        userperfil: {
            avatar: '',
            info: '',
            estado: '',
        },
        authenticated: false
    },
    users: { type: Array },
    users: [],
    valido: false,
    alma: false,

    post: {
        autor: '',
        titulo: '',
        img: '',
        contenido: '',
        categoria: '',
        estado: '',
        ciudad: '',
        direccion: '',
        fecha_update: { type: Date },
        tags: [],
        likes: 0,
        comentarios: [],
        activa: { type: Boolean },
        respaldos: [],
    },
    posts: { type: Array },
    posts: [],
    postsEnte: { type: Array },
    postsEnte: [],
    //Envia una solicitud para iniciar sesion y validar usuario y obtener el token de acceso  JWT
    login(creds, redirect) {
        axios.post(LOGIN_URL, creds).then(response => {
            localStorage.setItem('id_token', response.data.id);
            localStorage.setItem('access_token', response.data.token);
            this.user.authenticated = true
            router.push(redirect);
        }).error((err) => console.log(err))
    },

    // Metodo que realiza la insersion de un nuevo usuario en el sistema

    signup(creds, redirect, data) {
        axios.post(SIGNUP_URL, creds).then(response => {
            console.log('Listo')
        }).catch(error => {
            console.log(error)
        });
        if (data._cls == 'User.Persona') {
            axios.post(GETUSER_URL, data).then(response => {
                this.alma == true;
                window.alert(this.alma);
            })
        }
        if (data._cls == 'User.Comunidad') {
            axios.post('http://localhost:8000/api/user/', data).then(response => {
                this.alma = true;
                window.alert(this.alma);
            }).catch(error => {
                window.alert(error)
            });
        }
        if (data._cls == 'User.Ente') {
            axios.post(GETUSER_URL, data).then(response => {
                this.alma == true;
                window.alert(this.alma)
            })
        }
        //window.alert(this.alma);
        router.push(redirect);
    },

    // Remueve el token al salir del sistema
    logout() {
        localStorage.removeItem('id_token')
        localStorage.removeItem('access_token')
        this.user.authenticated = false
        router.push('/')
    },
    // Metodo para obtener todos los usuarios del sistema
    getUsers() {
        axios.get(GETUSER_URL).then(response => {
            this.users = response.data;
        }).catch(error => {
            console.log(error);
        })
    },
    checkUser(data) {

        for (var i = 0; i < this.users.length; i++) {
            if (data.username == this.users[i].email && data.password == this.users[i].password) {
                this.user = this.users[i];
                this.valido = true
                break;
            }
        }
        return this.valido

    },
    checkAuth() {
        var jwt = localStorage.getItem('access_token');
        if (jwt) {
            this.user.authenticated = true;
            return true;
        } else {
            this.user.authenticated = false;
            return false;
        }
    },

    // The object to be passed as a header for authenticated requests
    getAuthHeader() {
        return localStorage.getItem('access_token');
    },
    getUser() {
        return this.user;
    },
    getPosts() {
        axios.get(POST_URL, {
                headers: { Authorization: `JWT ${auth.getAuthHeader()}` }
            }).then(response => {
                this.posts = response.data
            })
            .catch(erros => {
                console.log(error);
            })
        return this.posts;
    },

    checkTipoUser() {
        var a = getUser()
        var p = getPosts()
        if (a._cls = "User.Ente") {
            for (var i = 0; i < p.length; i++) {
                if (a.area == p[i].categoria) {
                    this.postsEnte.push(p[i]);
                }
            }
            return this.postsEnte;

        } else {
            return p;
        }
    },

    // Metodo para crear una nueva publicacion

    createPost(datos, route) {
        axios.post(POST_URL, datos).then(response => {
            this.alma = true;
            router.push(route);
            window.alert(this.alma)
        }).catch(error => {
            console.log(error)
        });

    },
    updatePerfil(datos, ruote) {
        axios.put('http://localhost:8000/api/user/' + datos.id + '/', {
            name: datos.name,
            email: datos.email,
            userperfil: {
                avatar: datos.userperfil.avatar,
                info: datos.userperfil.info,
                estado: datos.userperfil.estado,
            },
            direccion: datos.direccion
        }).then(respose => {
            this.update = true;
            router.push(route);
        }).catch(error => {
            console.log(error)
        })
    }

}
export function requireAuth(to, from, next) {
    if (!checkAuth()) {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    } else {
        next();
    }
}
export function requireUser(to, from, next) {
    if (!checkAuth()) {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    } else {
        next();
    }
}