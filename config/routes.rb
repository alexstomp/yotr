Rails.application.routes.draw do
  root 'application#home'

  get 'about' => 'application#about'
  get 'submit' => 'application#submit'
  get 'inspiration' => 'application#inspiration'
  get 'join' => 'application#join'

  # Auth/Authed Pages
  devise_for :users, :path => '', :path_names => {:sign_in => 'login', :sign_out => 'logout'}

  get 'posts' => 'admin#posts'

end
