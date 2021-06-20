import React from 'react';
import { StyleSheet, Button, View } from 'react-native';
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import Header from './src/components/Header';
import Score from './src/components/Score';
import Card from './src/components/Card';
import helpers from './src/helper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff'
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  body: {
    flex: 18,
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 20
  }
});

export default class App extends React.Component {
 
  constructor(props) {
    super(props);
    
    // icon sources
    let sources = {
      'fontawesome': FontAwesome,
      'entypo': Entypo,
      'ionicons': Ionicons
    };

    // the unique icons to be used
    let cards = [
      {
        src: 'fontawesome',
        name: 'heart',
        color: 'red'
      },
      {
        src: 'entypo',
        name: 'feather',
        color: '#7d4b12'
      },
      {
        src: 'entypo',
        name: 'flashlight',
        color: '#f7911f'
      },
      {
        src: 'entypo',
        name: 'flower',
        color: '#37b24d'
      },
      {
        src: 'entypo',
        name: 'moon',
        color: '#ffd43b'
      },
      {
        src: 'entypo',
        name: 'youtube',
        color: '#FF0000'
      },
      {
        src: 'entypo',
        name: 'shop',
        color: '#5f5f5f'
      },
      {
        src: 'fontawesome',
        name: 'github',
        color: '#24292e'
      },
      {
        src: 'fontawesome',
        name: 'skype',
        color: '#1686D9'
      },
      {
        src: 'fontawesome',
        name: 'send',
        color: '#1c7cd6'
      },
      {
        src: 'ionicons',
        name: 'ios-magnet',
        color: '#d61c1c'
      },
      {
        src: 'ionicons',
        name: 'logo-facebook',
        color: '#3C5B9B'
      }
    ];

    // bind the functions to the class
    this.renderCards = this.renderCards.bind(this);
    this.resetCards = this.resetCards.bind(this);
 
    // next: add code creating the clone and setting the cards in the state
    this.cards = cards.concat(JSON.parse(JSON.stringify(cards))) // combine the original and the clone
    this.cards.forEach((obj) => {
      let id = Math.random().toString(36).substring(7);
      obj.id = id;
      obj.src = sources[obj.src];
      obj.is_open = false;
      return obj;
    });
    this.cards = this.cards.shuffle(); // sort the cards randomly
    this.state = {
      current_selection: [], // this array will contain an array of card objects which are currently selected by the user. This will only contain two objects at a time.
      selected_pairs: [], // the names of the icons. This array is used for excluding them from further selection
      score: 0, // default user score
      cards: this.cards // the shuffled cards
    }
    
  }

  renderRows() {
  
    let contents = this.getRowContents(this.state.cards);
    return contents.map((cards, index) => {
      return (
        <View key={index} style={styles.row}>
          { this.renderCards(cards) }
        </View>
      );
    });
    
  }

  clickCard(id) {
    let selected_pairs = this.state.selected_pairs;
    let current_selection = this.state.current_selection;
    let score = this.state.score;
    // get the index of the currently selected card
    let index = this.state.cards.findIndex((card) => {
      return card.id == id;
    });
   
    let cards = this.state.cards;
     
    // the card shouldn't already be opened and is not on the array of cards whose pairs are already selected
    if(cards[index].is_open == false && selected_pairs.indexOf(cards[index].name) === -1){
   
      // next: add code for processing the selected card
      cards[index].is_open = true;
     
      current_selection.push({ 
        index: index,
        name: cards[index].name
      });

      if(current_selection.length == 2){
        if(current_selection[0].name == current_selection[1].name){
          score += 1; // increment the score
          selected_pairs.push(cards[index].name); 
        }else{
          cards[current_selection[0].index].is_open = false; // close the first
           
          // delay closing the currently selected card by half a second.
          setTimeout(() => {
            cards[index].is_open = false;
            this.setState({
              cards: cards
            });
          }, 500);
        }
       
        current_selection = [];
      }
       
    }

    this.setState({
      score: score,
      cards: cards,
      current_selection: current_selection
    });
   
  }

  resetCards() {
    // close all cards
    let cards = this.cards.map((obj) => {
      obj.is_open = false;
      return obj;
    });
   
    cards = cards.shuffle(); // re-shuffle the cards
     
    // update to default state
    this.setState({
      current_selection: [],
      selected_pairs: [],
      cards: cards,
      score: 0
    });
  }

  renderCards(cards) {
    return cards.map((card, index) => {
      return (
        <Card 
          key={index} 
          src={card.src} 
          name={card.name} 
          color={card.color} 
          is_open={card.is_open}
          clickCard={this.clickCard.bind(this, card.id)} 
        />
      );
    });
  }

  getRowContents(cards) {
    let contents_r = [];
    let contents = [];
    let count = 0;
    cards.forEach((item) => {
      count += 1;
      contents.push(item);
      if(count == 4){
        contents_r.push(contents)
        count = 0;
        contents = [];
      }
    });
    return contents_r;
  }

  render() {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.body}>
          { 
            this.renderRows.call(this) 
          }
        </View>
        <Score score={this.state.score} />
        <Button
          onPress={this.resetCards}
          title="Reset"
          color="#008CFA"
        />
      </View>
    );
  }
 
}