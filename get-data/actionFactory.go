package main

// Action interface
type Action interface {
	Name() string
	Do() (string, error)
}

// actionFactory contains a map[string] of all available actions
// index value is the returned string from the actions Name() function
type actionFactory struct {
	actions map[string]Action
}

// Constructor function for the action factory
func NewActionFactory() *actionFactory {
	factory := &actionFactory{}
	factory.actions = make(map[string]Action)
	return factory
}

// Add Action
func (factory *actionFactory) AddAction(action Action) *actionFactory {
	factory.actions[action.Name()] = action
	return factory
}

// Return the specified action
func (factory *actionFactory) GetAction(queryStringParameters *map[string]string) Action {
	var name string

	_, bzExist := (*queryStringParameters)["bz"]
	_, levelsExist := (*queryStringParameters)["levels"]

	switch {
	case bzExist:
		name = "bz"
	case levelsExist:
		name = "levels"
	default:
		name = "all"
	}

	action := factory.actions[name]

	return action
}
