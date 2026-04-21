Rails.application.routes.draw do
  get 'issues/index'
  get 'issues/create'
  get 'me/index'
  post "/register", to: "auth#register"
  post "/login", to: "auth#login"
  resources :issues, only: [:index, :create, :update, :destroy ]
  post "/graphql", to: "graphql#execute"
  get "/me", to: "me#index"
end