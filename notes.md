# Notes on Common JS patterns and functions

## State Management
- useEffect(), takes in a function and a dependency array.
    - Basic `useEffect(()=>{log something...}, [])`
    - When the page renders this useEffect hook is run only once since we specified an empty dependency array
    - When we specify a value within the dependency array this means the use effect hook runs on render and when that value changes.
    - This can be useful for rendering information on page start, tracking values in state, and handling side effects in our code. 
    - When we use the useEffect statement to retrieve data from an API `useEffect(()=>{getData()}, [])` The data only exists after useEffect executes.
    - This means we cannot reference the data without using one of the following methods.
        - `data?.name` or `data && data.name` essentially checking for existence before using. 

- useState(), maintains values throughout the application tracking changes and managing updates.
    - This function returns 2 values a state variable and a set function, `const [stateVar, setFunc] = useState(inital state)`
    - This function allows us to maintian consistent values across our components based on a single state.
    
- Controlled Elements
    - This allows us to update the state of variables within different components from the parent.
    - Instead of passing the set function directly down, we reference this as an interface defining component props or a custom props type for the component.
    - When this is used to pass through many layers we can have context drilling.


- Mapping
    - 
## Components


## Context API