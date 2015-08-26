Rails.application.routes.draw do
  root 'application#home'

  get 'about' => 'application#about'
  get 'submit' => 'application#submit'
  get 'inspiration' => 'application#inspiration'
  get 'join' => 'application#join'

  # Auth/Authed Pages
  devise_for :users

end
