import functions from "../assets/js/functions.js";
import store from "../assets/js/store.js";

export default {
  name: "ModificaDati",

  data() {
    return {
      newNome: "",
      newCognome: "",
      newEmail: "",
      newTelefono: "",
      editNome: "",
      editCognome: "",
      editEmail: "",
      editTelefono: "",
      dati: JSON.parse(localStorage.getItem("dati")) || [],
      globalIndex: null,
      datatable: null,
      notiMessage: null,
    };
  },
  setup() {
    const { ref, onMounted, watchEffect } = Vue;
    const title = "ModificaDati";
    //get data from server
    const serverdata = ref(null);
    const tabledata = ref(null);
    onMounted(() => {
      serverdata.value = JSON.parse(localStorage.getItem("dati")) || [];
    });

    //search
    watchEffect(() => {
      if (serverdata.value) {
        if (store.searchString) {
          tabledata.value = serverdata.value.filter(function (finder) {
            return JSON.stringify(finder).includes(store.searchString);
          });
        } else {
          tabledata.value = serverdata.value;
        }
      }
    });

    //table sort
    let sortByColumn = ref(null);
    watchEffect(() => {
      if (serverdata.value) {
        if (!sortByColumn.value && store.sortedColumn) {
          serverdata.value.sort(
            functions.methods.sort(store.sortedColumn, store.sortedOrder)
          );
        }
        if (sortByColumn.value == store.sortedColumn) {
          if (store.sortedOrder == "asc") {
            store.sortedOrder = "desc";
          } else {
            store.sortedOrder = "asc";
          }
          serverdata.value.sort(
            functions.methods.sort(sortByColumn.value, store.sortedOrder)
          );
          store.sortedColumn = sortByColumn.value;
        } else {
          serverdata.value.sort(
            functions.methods.sort(sortByColumn.value, "asc")
          );
          store.sortedOrder = "asc";
          store.sortedColumn = sortByColumn.value;
        }
        sortByColumn.value = null;
      }
    });

    return { tabledata, store, sortByColumn, title };
  },
  methods: {
    aggiungi: function () {
      if (
        !this.newNome ||
        !this.newCognome ||
        !this.newEmail ||
        !this.newTelefono
      ) {
        functions.methods.notificationSend("danger", "Compila tutti i campi!");
      } else {
        functions.methods.notificationSend("success", "Dato aggiunto!");
        var newEntry = {
          nome: this.newNome,
          cognome: this.newCognome,
          email: this.newEmail,
          telefono: this.newTelefono,
        };
        this.dati.push(newEntry);
        this.tabledata.push(newEntry);
        this.newNome = "";
        this.newCognome = "";
        this.newEmail = "";
        this.newTelefono = "";
        this.aggiornaLocalStorage();
      }
    },
    ricorda(index) {
      this.editNome = this.dati[index].nome;
      this.editCognome = this.dati[index].cognome;
      this.editEmail = this.dati[index].email;
      this.editTelefono = this.dati[index].telefono;
      this.globalIndex = index;
    },
    modifica() {
      if (
        !this.editNome ||
        !this.editCognome ||
        !this.editEmail ||
        !this.editTelefono
      ) {
        functions.methods.notificationSend("danger", "Compila tutti i campi!");
      } else {
        functions.methods.notificationSend("success", "Dato modificato!");
      }
      var editEntry = {
        nome: this.editNome,
        cognome: this.editCognome,
        email: this.editEmail,
        telefono: this.editTelefono,
      };
      this.dati.splice(this.globalIndex, 1, editEntry);
      this.tabledata.splice(this.globalIndex, 1, editEntry);
      this.aggiornaLocalStorage();
    },
    elimina(index) {
      functions.methods.notificationSend("success", "Dato eliminato!");
      this.dati.splice(index, 1);
      this.tabledata.splice(index, 1);
      this.aggiornaLocalStorage();
    },
    aggiornaLocalStorage() {
      localStorage.setItem("dati", JSON.stringify(this.dati));
    },
  },
  template: `
  <div id="notification">{{ store.notificationMessage }}
    <div id="progress"></div>
  </div> 
  <section id="dataTable">
  <section id="editForm" aria-expanded="false">
        <form @submit.prevent="modifica">
          <section>
              <i class="fe-x" id="openEditForm"></i>
              <button @click="modifica()" type="submit">
                <i class="fe-save"></i>
              </button>                
          </section>
          <article>
          <h3>Nome:</h3>
          <input v-model="editNome" placeholder="Modifica Nome" />
          <h3>Cognome:</h3>
          <input v-model="editCognome" placeholder="Modifica Cognome" />
          <h3>Email:</h3>
          <input v-model="editEmail" placeholder="Es: esempio@gmail.com" type="email" />
          <h3>Telefono:</h3>
          <input v-model="editTelefono" placeholder="Es: 3334445555" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" />
          </article>
          </form>   
      </section>
        <section id="addForm" aria-expanded="false">
          <form @submit.prevent="aggiungi">
            <section>
                <i class="fe-x" id="openAddForm"></i>
                <button type="submit">
                  <i class="fe-save"></i>
                </button>                
            </section>
            <article>
            <h3>Nome:</h3>
            <input v-model="newNome" placeholder="Inserisci nome"/>
            <h3>Cognome:</h3>
            <input v-model="newCognome" placeholder="Inserisci cognome" />
            <h3>Email:</h3>
            <input v-model="newEmail" placeholder="Es: esempio@gmail.com" type="email" />
            <h3>Telefono:</h3>
            <input v-model="newTelefono" placeholder="Es: 3334445555" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" />
            </article>
            </form>  
        </section>
        <section id="table-title">
    <h1> {{ title }} </h1>
    <small v-if="tabledata && store.searchString"><b>{{ tabledata.length }}</b> corrispondenza/e.</small>
    </section>
    <input v-model="store.searchString" placeholder="Cerca...">
    <table>
    <thead>
      <tr>
        <th><a href="javascript:void(0);" v-on:click="sortByColumn = 'nome'">Nome</a></th>
        <th><a href="javascript:void(0);" v-on:click="sortByColumn = 'cognome'">Cognome</a></th>
        <th><a href="javascript:void(0);" v-on:click="sortByColumn = 'email'">Email</a></th>
        <th><a href="javascript:void(0);" v-on:click="sortByColumn = 'telefono'">Telefono</th>
        <th>Azioni</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(dato, index) in tabledata" :key="index">
        <td>{{ dato.nome }}</td>
        <td>{{ dato.cognome }}</td>
        <td>{{ dato.email }}</td>
        <td>{{ dato.telefono }}</td>
        <td class="actions">
          <button @click="ricorda(index)">
            <i class="fe-edit"></i>
          </button>
          <button @click="elimina(index)">
            <i class="fe-trash-2"></i>
          </button>
        </td>  
      </tr>
    </tbody>
    </table>
    <button class="addNewDataBtn">
      <i class="fe-plus" id="openAddForm"></i>
    </button>
 </section>
    `,
};
