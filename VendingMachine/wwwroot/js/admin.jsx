class Drink extends React.Component {
    constructor(props) {
        super(props);
        this.state = { drink: this.props.drink, isVisible: true, logo: this.props.drink.logo };
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.addError = this.addError.bind(this);
        this.checkBox = React.createRef();
        this.fileInput = React.createRef();
        this.nameInput = React.createRef();
        this.priceInput = React.createRef();
        this.countInput = React.createRef();
    }
    addError(errors) {
        errors.forEach(error => {
            let p = document.createElement("p");
            p.append(error);
            document.getElementById(`errors${this.state.drink.id}`).append(p);
        });
    }
    onDelete() {
        let xhr = new XMLHttpRequest();
        xhr.open("delete", `api/drinks/${this.state.drink.id}`, true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                this.setState({ isVisible: false });
            }
        }.bind(this);
        xhr.send();
    }

    onSave() {
        let tempDrink = {};
        tempDrink.id = this.state.drink.id;
        tempDrink.name = this.nameInput.current.value;
        tempDrink.logo = this.state.drink.logo;//меняется отдельным запросом
        tempDrink.price = this.priceInput.current.value;
        tempDrink.count = this.countInput.current.value;
        tempDrink.availability = this.checkBox.current.checked;

        let xhr = new XMLHttpRequest();
        xhr.open("put", "api/drinks", true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                document.getElementById(`errors${this.state.drink.id}`).classList.add("d-none");
                if (this.fileInput.current.files.length > 0) {
                    let data = new FormData();
                    data.append("file", this.fileInput.current.files[0]);
                    xhr.open("put", `api/drinks/${this.state.drink.id}`, true);
                    xhr.onload = function() {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            document.getElementById(`errors${this.state.drink.id}`).classList.add("d-none");
                            this.setState({ logo: xhr.response });
                        } else {
                            var p = document.createElement("p");
                            p.append(xhr.response);
                            document.getElementById(`errors${this.state.drink.id}`).append(p);
                            document.getElementById(`errors${this.state.drink.id}`).classList.remove("d-none");
                        }
                    }.bind(this);
                    xhr.send(data);
                }
            } else {
                let errorData = JSON.parse(xhr.response);
                if (errorData) {
                    // ошибки валидации по атрибутам
                    if (errorData.errors) {
                        if (errorData.errors["Name"]) {
                            this.addError(errorData.errors["Name"]);
                        }
                        if (errorData.errors["Logo"]) {
                            this.addError(errorData.errors["Logo"]);
                        }
                        if (errorData.errors["Price"]) {
                            this.addError(errorData.errors["Price"]);
                        }
                        if (errorData.errors["Count"]) {
                            this.addError(errorData.errors["Count"]);
                        }
                        if (errorData.errors["Availability"]) {
                            this.addError(errorData.errors["Availability"]);
                        }
                    }
                }
                document.getElementById(`errors${this.state.drink.id}`).classList.remove("d-none");
            }
        }.bind(this);
        xhr.send(JSON.stringify(tempDrink));
    }
    render() {
        if (this.state.isVisible) {
            return (
                <div className="col-lg-3 col-md-4 col-sm-12 p-2">
                    <div className="card h-100">
                        <img className="card-img-top" src={this.state.logo} alt={this.state.drink.name} />
                        <div id={`errors${this.state.drink.id}`} className="alert alert-danger p-1 m-0 d-none"/>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <label className="form-label">Название</label>
                                <input ref={this.nameInput} className="form-control" type="text" defaultValue={this.state.drink.name}/>
                            </li>
                            <li className="list-group-item">
                                <label className="form-label">Цена</label>
                                <input ref={this.priceInput} className="form-control" type="text" defaultValue={this.state.drink.price}/>
                            </li>
                            <li className="list-group-item">
                                <label htmlFor={`file${this.state.drink.id}`} className="form-label">Изображение</label>
                                <input ref={this.fileInput} className="form-control" type="file" id={`file${this.state.drink.id}`}/>
                            </li>
                            <li className="list-group-item">
                                <label className="form-label">Количество</label>
                                <input ref={this.countInput} className="form-control" type="text" defaultValue={this.state.drink.count}/>
                            </li>
                            <li className="list-group-item">
                                <div className="form-check">
                                    <input ref={this.checkBox} className="form-check-input" type="checkbox"
                                        defaultChecked={this.state.drink.availability} id={`check${this.state.drink.id}`}/>
                                    <label className="form-check-label" htmlFor={`check${this.state.drink.id}`}>
                                        Доступность
                                    </label>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <button onClick={this.onSave} type="button" className="btn btn-link">Сохранить</button>
                                <button onClick={this.onDelete} type="button" className="btn btn-link">Удалить</button>
                            </li>
                        </ul>
                    </div>
                </div>
            );
        } else {

            return (<div className="d-none"/>);
        }
    }
}
class DrinksList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { drinks: [] };
        this.onClick = this.onClick.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.checkBox = React.createRef();
        this.fileInput = React.createRef();
        this.nameInput = React.createRef();
        this.priceInput = React.createRef();
        this.countInput = React.createRef();
    }
    componentDidMount() {
        this.loadDrinks();
    }
    loadDrinks() {
        let xhr = new XMLHttpRequest();
        xhr.open("get", "api/drinks/all", true);
        xhr.onload = function () {
            let data = JSON.parse(xhr.response);
            this.setState({ drinks: data });
        }.bind(this);
        xhr.send();
    }
    clearForm(){
        this.nameInput.current.value = "";
        this.priceInput.current.value = "0";
        this.fileInput.current.value = "";
        this.countInput.current.value = "0";
        this.checkBox.current.checked = false;
    }
    onClick() {
        let temp = {};
        temp.name = this.nameInput.current.value;
        temp.logo = "file";
        temp.price = this.priceInput.current.value;
        temp.count = this.countInput.current.value;
        temp.availability = this.checkBox.current.checked;

        let xhr = new XMLHttpRequest();
        xhr.open("post", "api/drinks", true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                document.getElementById("errorsForm").classList.add("d-none");
                let data = new FormData();
                data.append("file", this.fileInput.current.files[0]);
                let dataResponse = JSON.parse(xhr.response);
                temp.id = dataResponse.id;
                xhr.open("put", `api/drinks/${dataResponse.id}`, true);
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        document.getElementById("errorsForm").classList.add("d-none");
                        temp.logo = xhr.response;
                        let tempDrinksList = this.state.drinks;
                        tempDrinksList.push(temp);
                        this.setState({drink:tempDrinksList});
                        this.clearForm();
                    } else {
                        let p = document.createElement("p");
                        p.append(xhr.response);
                        document.getElementById("errorsForm").append(p);
                        document.getElementById("errorsForm").classList.remove("d-none");

                        xhr.open("delete", `api/drinks/${dataResponse.id}`, true);
                        xhr.send();
                    }
                }.bind(this);
                xhr.send(data);
            } else {
                let errorData = JSON.parse(xhr.response);
                if (errorData) {
                    // ошибки вследствие валидации по атрибутам
                    if (errorData.errors) {
                        if (errorData.errors["Name"]) {
                            this.addError(errorData.errors["Name"]);
                        }
                        if (errorData.errors["Logo"]) {
                            this.addError(errorData.errors["Logo"]);
                        }
                        if (errorData.errors["Price"]) {
                            this.addError(errorData.errors["Price"]);
                        }
                        if (errorData.errors["Count"]) {
                            this.addError(errorData.errors["Count"]);
                        }
                        if (errorData.errors["Availability"]) {
                            this.addError(errorData.errors["Availability"]);
                        }
                    }
                }
                document.getElementById("errorsForm").classList.remove("d-none");
            }
        }.bind(this);
        xhr.send(JSON.stringify(temp));
    }
    render() {
        return (<div>
            <p className="h2">Управление напитками</p>
            <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-12 p-2">
                    <div className="card h-100">
                        <img className="card-img-top" src="upload/deflogo.png" alt="deflogo.png"/>
                        <div id="errorsForm" className="alert alert-danger p-1 m-0 d-none"/>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <label className="form-label">Название</label>
                                <input ref={this.nameInput} className="form-control" type="text" defaultValue=""/>
                            </li>
                            <li className="list-group-item">
                                <label className="form-label">Цена</label>
                                <input ref={this.priceInput} className="form-control" type="text" defaultValue="0"/>
                            </li>
                            <li className="list-group-item">
                                <label htmlFor="formFile" className="form-label">Изображение</label>
                                <input ref={this.fileInput} className="form-control" type="file" id="formFile"/>
                            </li>
                            <li className="list-group-item">
                                <label className="form-label">Количество</label>
                                <input ref={this.countInput} className="form-control" type="text" defaultValue="0"/>
                            </li>
                            <li className="list-group-item">
                                <div className="form-check">
                                    <input ref={this.checkBox} className="form-check-input" type="checkbox"
                                        defaultChecked={false} id="check0"/>
                                    <label className="form-check-label" htmlFor="check0">Доступность</label>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <button onClick={this.onClick} type="button" className="btn btn-link">Добавить</button>
                            </li>
                        </ul>
                    </div>
                </div>
                {
                    this.state.drinks.map(function (drink) {
                        return <Drink key={drink.id} drink={drink}/>;
                    })
                }
            </div>
        </div>);
    }
}

class Coin extends React.Component {
    constructor(props) {
        super(props);
        this.checkBox = React.createRef();
        this.countInput = React.createRef();
        this.onClick = this.onClick.bind(this);
        this.state = { coin: this.props.coin };
    }
    onClick(){
        let xhr = new XMLHttpRequest();
        let tempCoin = this.state.coin;
        tempCoin.count = this.countInput.current.value;
        tempCoin.availability = this.checkBox.current.checked;
        xhr.open("put", "api/coins", true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        xhr.send(JSON.stringify(tempCoin));
    }
    render() {
        return (<li className="list-group-item container">
            <div className="row">
            <p className="h3 col-1">{this.state.coin.denomination}р </p>
            <div className="form-check col-2">
                <input ref={this.checkBox} className="form-check-input" type="checkbox"
                    defaultChecked={this.state.coin.availability} id={`coinCheck${this.state.coin.id}`}/>
                <label className="form-check-label" htmlFor={`coinCheck${this.state.coin.id}`}>Доступность</label>
            </div>
            <div className="col-2">
                <label className="form-label">Количество</label>
                <input ref={this.countInput} className="form-control" type="text" defaultValue={this.state.coin.count}/>
            </div>
            <button onClick={this.onClick} type="button" className="btn btn-link col-1">Изменить</button>
            </div>
        </li>);
    }
}
class CoinsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { coins: [] };
    }
    loadCoins() {
        let xhr = new XMLHttpRequest();
        xhr.open("get", "api/coins", true);
        xhr.onload = function () {
            let data = JSON.parse(xhr.response);
            this.setState({ coins: data });
        }.bind(this);
        xhr.send();
    }
    componentDidMount() {
        this.loadCoins();
    }
    render() {
        return (<div>
            <p className="h2">Управление монетами</p>
            <ul className="list-group">
                {
                    this.state.coins.map(function (coin) {
                        return <Coin key={coin.id} coin={coin}/>;
                    })
                }
            </ul>
        </div>);
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { admin:false}
    }
    componentDidMount() {
        this.load();
    }
    load() {
        let res = prompt("Введите код доступа", "");
        if (res === "" || res === null) {
            document.location.href = "/";
        }
        let xhr = new XMLHttpRequest();
        xhr.open("get", `api/users/${res}`, true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                this.setState({ admin: true });
            } else {
                document.location.href = "/";
            }
            
        }.bind(this);
        xhr.send();
    }
    render() {
        if (this.state.admin) {
            return (
                <div>
                    <div className="h1">Панель администратора</div>
                    <CoinsList />
                    <DrinksList />
                </div>
            );
        } else {
            return (
                <div/>
            );
        }
        
    }
}
ReactDOM.render(
    <App />,
    document.getElementById("root")
);