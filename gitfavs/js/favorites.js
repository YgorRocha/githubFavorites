import { GithubUser } from "./githubuser.js"


export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
        
        const currentClass = localStorage.getItem('currentClass');
        if (currentClass) {
          document.querySelector('.app').classList.toggle('hide', currentClass === '.app2');
          document.querySelector('.app2').classList.toggle('hide', currentClass === '.app');
        }
    }
        
    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
        const currentClass = document.querySelector('.app').classList.contains('hide') ? '.app2' : '.app';
        localStorage.setItem('currentClass', currentClass);
    }

    async add(username) {
        try {
          const userExists = this.entries.find(entry => entry.login === username);
      
          if (userExists) {
            throw new Error("User already registered");
          }
      
          const user = await GithubUser.search(username);
          if (user.login === undefined) {
            throw new Error("User Not Found!");
          }
      
          this.entries = [user, ...this.entries];
          this.changeClassApp();
          this.save();
          this.update();
        } catch (error) {
          alert(error.message);
        }
    }
    
    delete(user){
     const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
     this.entries = filteredEntries
     this.changeClassApp()
     this.save()
     this.update()
    }
}

export class FavoriteView extends Favorites{
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onAdd()
    }

    onAdd(){
    const addButton = document.querySelector('.search button')
    
    addButton.onclick = () =>{
     const {value} = document.querySelector('.search input')  
     
     this.add(value)

    }
    }

    update(){
        this.removeAllTr()

        this.entries.forEach(user =>{
            const row = this.creatRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            this.tbody.append(row)

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Are you sure want to delete this user?')

                if(isOk){
                    this.delete(user)
                }
            }
        })


    }

    creatRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `<td class="user">
        <img src="https://github.com/ygorrocha.png" alt="Imagem do YgorRocha">
        <a href="https://github.com/ygorrocha" target="_blank">
            <p></p>
            <span>ygorrocha</span>
        </a>
    </td>
    <td class="repositories">77</td>
    <td class="followers">4800</td>
    <td>
      <button class="remove">Remove</button>
    </td>`

    return tr
    }

    changeClassApp(){
     if (this.entries.length === 0) {
        document.querySelector('.app').classList.add('hide');
        document.querySelector('.app2').classList.remove('hide');
    } else{
        document.querySelector('.app').classList.remove('hide');
        document.querySelector('.app2').classList.add('hide');
    }
    }

    removeAllTr(){
this.tbody.querySelectorAll('tr').forEach((tr) => {
    tr.remove()
})
    }
}


