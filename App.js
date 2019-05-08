import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

import axios from 'axios'

import List from './components/List'
import Input from './components/Input'
import Title from './components/Title'

const baseUrl = 'http://192.168.0.100:3000/api/tasks/'

export default class App extends Component {

    state = {
        loading: true,
        error: false,
        todos: []
    }

    async componentWillMount() {
        await axios.get(baseUrl).then(res => {
            this.setState({
                loading: false,
                todos: res.data
            })
		}).catch(err => {
            this.setState({
                error: true
            })
		})
    }

    onAddTodo = async (text) => {
        const { todos } = this.state

        const task = {
            title: text,
            description: text,
            status: false
        }

        await axios.post(baseUrl, task).then(res => {
			todos.push(res.data.result)
            this.setState({
                todos
            })
		}).catch(error => {
            this.setState({
                error: true
            })
		})
    }

    onRemoveTodo = async (index, id) => {
        const { todos } = this.state

        await axios.delete(baseUrl + id).then(res => {
            todos.splice(index, 1)
            this.setState({
                todos
            })
        }).catch(error => {
            this.setState({
                error: true
            })
        })
    }

    render() {
        const { loading, error, todos } = this.state

        if (loading) {
          return (
            <View style={styles.centerLayout}>
              <ActivityIndicator animating={true} />
            </View>
          )
        }

        if (error) {
          return (
              <View style={styles.centerLayout}>
                <Text>
                  Error fetching todos
                </Text>
              </View>
          )
        }

        if (todos.length > 0) {
            return (
                <View>
                  <Title>
                    To-Do List
                  </Title>
                  <Input
                    placeholder={'Type a todo, then hit enter!'}
                    onSubmitEditing={this.onAddTodo}
                  />
                  <List
                      list={todos}
                      onPressItem={this.onRemoveTodo}
                    />
                </View>
            )
        }
        return (
            <View style={styles.container}>
              <Title>
                To-Do List
              </Title>
              <Input
                placeholder={'Type a todo, then hit enter!'}
                onSubmitEditing={this.onAddTodo}
              />
              <View style={styles.subLayout}>
                  <Text>
                    No Post Yet!
                  </Text>
              </View>
            </View>
        )
  }
}

const styles = StyleSheet.create({
    centerLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    subLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
