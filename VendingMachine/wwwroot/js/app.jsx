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
        this.state = { drinks: [] };
        this.onSelectDrink = this.onSelectDrink.bind(this);
        this.filterList = this.filterList.bind(this);
        this.drinksList = [];
    }
    // фильтрация списка
    filterList(e) {
        console.log(drinksList);
        var filteredList = this.drinksList.filter(function (item) {
            return item.price >= this.props.checkSum;
        });
        // обновление состояния
        this.setState({ drinks: filteredList });
    }
    // загружаем данные
    loadData() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", this.props.apiUrl, true);
        xhr.onload = function () {
            this.drinksList = JSON.parse(xhr.responseText);
        }.bind(this);
        xhr.send();
    }
    componentDidMount() {
        this.loadData();
    }
    onSelectDrink(drink) {
        console.log(drink);
    }
    render() {
        var select = this.onSelectDrink;
        return (<div>
            <p className="h2">Доступные напитки</p>
            <div className="row">
                {
                    this.state.drinks.map(function (drink) {
                        if (drink.availability === true && drink.count > 0) {
                            return <Drink key={drink.id} drink={drink} onSelect={select}/>;
                        } else {
                            return null;
                        }
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
        this.props.onClickCoin(this.state.coin.denomination);
    }
    render() {
        if (this.state.coin.availability === true && this.state.coin.count>0) {
            return (<button onClick={this.onClick} className="btn btn-primary btn-lg">{this.state.coin.denomination}р</button>);
        } else {
            return (<button disabled className="btn btn-primary btn-lg">{this.state.coin.denomination}р</button>);
        }
    }
}
class CoinsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { coins: [], sum:0 };
        this.onClickCoin = this.onClickCoin.bind(this);
    }
    loadData() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", this.props.apiUrl, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ coins: data });
        }.bind(this);
        xhr.send();
    }
    componentDidMount() {
        this.loadData();
    }
    onClickCoin(denomination) {
        this.setState(state => ({
            sum: state.sum + denomination,
        }));
        this.props.updateSum(this.state.sum);
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
        this.state = { sum : 0};
        this.updateSum = this.updateSum.bind(this);
    }
    updateSum(value) {
        this.setState({sum : value });
    }
    render() {
        var update = this.updateSum;
        return (<div>
            <CoinsList updateSum={update} apiUrl="/api/coins" />
            <DrinksList checkSum={this.state.sum} apiUrl="/api/drinks" />
        </div>);
    }
}
ReactDOM.render(
    <App />,
    document.getElementById("root")
);