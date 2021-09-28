class Drink extends React.Component {
    constructor(props) {
        super(props);
        this.state = { drink: this.props.drink };
        this.onClick = this.onClick.bind(this);
    }
    onClick(e) { 
        this.props.onSelect(this.state.drink);
    }
    render() {
        return (
            <div className="col-lg-3 col-md-4 col-sm-12 p-2">
                <div className="card h-100" onClick={this.onClick}>
                    <img className="card-img-top" src={this.state.drink.logo} alt={this.state.drink.name} />
                    <div className="card-body">
                        <h5 className="card-title">{this.state.drink.name}</h5>
                        <p className="card-text">Цена {this.state.drink.price} руб.</p>
                    </div>
                </div>
            </div>
        );
    }
}
class DrinksList extends React.Component {
    constructor(props) {
        super(props);
        this.onSelectDrink = this.onSelectDrink.bind(this);
    }
    onSelectDrink(drink) {
        if (!drink) {
            return;
        }
        let xhr = new XMLHttpRequest();
        drink.count--;
        xhr.open("put", "/api/drinks", true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                xhr.open("put", "/api/coins/inc", true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        xhr.open("put", `/api/coins/dec/${this.props.sum - drink.price}`, true);
                        xhr.onload = function () {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                let str = "Ваша сдача: ";
                                let data = JSON.parse(xhr.response);
                                for (let item in data) {
                                    str += (data[item] + " раз по " + item + "р, ");
                                }
                                str += "спасибо за покупку!";
                                alert(str);
                                document.location.href = "/";
                            }
                        }.bind(this);
                        xhr.send();
                    }
                }.bind(this);
                xhr.send(JSON.stringify(this.props.coins));
            }
        }.bind(this);
        xhr.send(JSON.stringify(drink));
    }
    render() {
        let select = this.onSelectDrink;
        return (<div>
            <p className="h2">Доступные напитки  - {this.props.drinks.length}</p>
            <div className="row">
                {
                    this.props.drinks.map(function (drink) {
                        return <Drink key={drink.id} drink={drink} onSelect={select}/>;
                    })
                }
            </div>
        </div>);
    }
}

class SimpleDrink extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="col-lg-3 col-md-4 col-sm-12 p-2">
                <div className="card h-100">
                    <img className="card-img-top" src={this.props.drink.logo} alt={this.props.drink.name} />
                    <div className="card-body">
                        <h5 className="card-title">{this.props.drink.name}</h5>
                        <p className="card-text">Цена {this.props.drink.price} руб.</p>
                    </div>
                </div>
            </div>
        );
    }
}
class SimpleDrinksList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<div>
            <p className="h2">Все напитки - {this.props.drinks.length}</p>
            <div className="row">
                {
                    this.props.drinks.map(function (drink) {
                        return <SimpleDrink key={drink.id} drink={drink}/>;
                    })
                }
            </div>
        </div>);
    }
}

class Coin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { coin: this.props.coin };
        this.onClick = this.onClick.bind(this);
    }
    onClick(e) {
        this.props.onClickCoin(this.state.coin);
    }
    render() {
        if (this.state.coin.availability === true && this.state.coin.count > 0) {
            return (<button onClick={this.onClick} className="btn btn-primary btn-lg">{this.state.coin.denomination}р</button>);
        } else {
            return (<button disabled className="btn btn-primary btn-lg">{this.state.coin.denomination}р</button>);
        }
    }
}
class CoinsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { coins: [], sum: 0, coinsClicked: {} };
        this.onClickCoin = this.onClickCoin.bind(this);
        this.coinsClickedList = {};
    }
    loadCoins() {
        let xhr = new XMLHttpRequest();
        xhr.open("get", "/api/coins", true);
        xhr.onload = function () {
            let data = JSON.parse(xhr.response);
            this.setState({ coins: data });
        }.bind(this);
        xhr.send();
    }
    componentDidMount() {
        this.loadCoins();
    }
    onClickCoin(coin) {
        this.setState(state => ({ sum: state.sum + coin.denomination }), function () {
            if (isNaN(this.coinsClickedList[coin.denomination])) {
                this.coinsClickedList[coin.denomination] = 1;
            } else {
                this.coinsClickedList[coin.denomination] += 1;
            }
            this.setState({ coinsClicked: this.coinsClickedList }, function() {
                this.filterList();
            });
            
        });
        
    }
    // фильтрация списка
    filterList() {
        let filteredList = this.props.drinksList.filter( item =>
            item.price <= this.state.sum
        );
        this.props.updateStates(filteredList, this.state.sum, this.state.coinsClicked);
    }
    
    render() {
        let click = this.onClickCoin;
        return (<div>
            <p className="h2">Внесите монеты</p>
            <div className="btn-group">
                {
                    this.state.coins.map(function (coin) {
                        return <Coin key={coin.id} coin={coin} onClickCoin={click}/>;
                    })
                }
            </div>
            <p className="h4">Внесенная сумма: {this.state.sum}р</p>
        </div>);
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { drinks: [], allDrinks: [], sum: 0, coins: {} };
        this.updateStates = this.updateStates.bind(this);
    }
    updateStates(value1,value2,value3) {
        this.setState({ drinks : value1 });
        this.setState({ sum: value2 });
        this.setState({ coins: value3 });
    }
    loadDrinks() {
        let xhr = new XMLHttpRequest();
        xhr.open("get", "api/drinks/notall", true);
        xhr.onload = function () {
            let data = JSON.parse(xhr.response);
            this.setState({ allDrinks : data });
        }.bind(this);
        xhr.send();
    }
    componentDidMount() {
        this.loadDrinks();
    }
    render() {
        let update = this.updateStates;

        return (<div>
            <CoinsList drinksList={this.state.allDrinks} updateStates={update} />
            <DrinksList coins={this.state.coins} drinks={this.state.drinks} sum={this.state.sum}/>
            <SimpleDrinksList drinks={this.state.allDrinks}/>
        </div>);
    }
}
ReactDOM.render(
    <App />,
    document.getElementById("root")
);