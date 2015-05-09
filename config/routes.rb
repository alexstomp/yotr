Rails.application.routes.draw do
  root 'application#home'

  get 'about' => 'application#about'
  get 'post' => 'application#new_post', :as => "new_post"
end
