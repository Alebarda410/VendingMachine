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
            <div className="col-lg-4 col-md-6 col-sm-12 p-2">
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
        if (drink) {
            var xhr = new XMLHttpRequest();
            drink.count--;
            xhr.open("put", "/api/drinks", true);
            xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    xhr.open("put", "/api/coins/inc", true);
                    xhr.setRequestHeader("Content-Type","application/json");
                    xhr.onload = function () {
                        if (xhr.status ===200) {
                            xhr.open("put", `/api/coins/dec/${this.props.sum - drink.price}`, true);
                            xhr.onload = function () {
                                if (xhr.status >= 200 && xhr.status < 300) {
                                    var str = "Ваша сдача: ";
                                    var data = JSON.parse(xhr.responseText);
                                    for (var item in data) {
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
    }
    render() {
        var select = this.onSelectDrink;
        return (<div>
            <p className="h2">Доступные напитки</p>
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
        this.drinksList = [];
        this.coinsClickedList = {};
    }
    loadCoins() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", this.props.apiUrl, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ coins: data });
            this.loadDrinks();
        }.bind(this);
        xhr.send();
    }
    loadDrinks() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", "api/drinks", true);
        xhr.onload = function () {
            this.drinksList = JSON.parse(xhr.responseText);
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
        var filteredList = this.drinksList.filter( item => 
            item.price <= this.state.sum
        );
        this.props.updateStates(filteredList, this.state.sum, this.state.coinsClicked);
    }
    
    render() {
        var click = this.onClickCoin;
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
        this.state = { drinks: [], sum: 0, coins: {} };
        this.updateStates = this.updateStates.bind(this);
    }
    updateStates(value1,value2,value3) {
        this.setState({ drinks : value1 });
        this.setState({ sum: value2 });
        this.setState({ coins: value3 });
    }
    render() {
        var update = this.updateStates;

        return (<div>
            <CoinsList updateStates={update} apiUrl="/api/coins" />
            <DrinksList coins={this.state.coins} drinks={this.state.drinks} sum={this.state.sum}/>
        </div>);
    }
}
ReactDOM.render(
    <App />,
    document.getElementById("root")
);