### Курс по командной разработке

#### Тема проекта : веб-приложение для контроля за доходами и расходами.

#### Кому это нужно?
   Всем желающим следить за своими доходами и расходами. 
   
#### Примерный вид приложения :
![](readme-source/head.png)
![](readme-source/foot.png)
![](readme-source/1.png)
![](readme-source/2.png)
![](readme-source/3.png)


#### 1. Регистрация : http://localhost:5000/api/signup
    
    Параметры : name,  email , password  
    
    Метод: POST

#### 2. Аутентификация : http://localhost:5000/api/signin
    
    Параметры : email, password
    
    Метод: POST

#### 3. Добавить категорию для затрат : http://localhost:5000/api/categories/
    
    Параметры : email, category
    
    Метод: POST

#### 4. Удалить категорию для затрат : http://localhost:5000/api/categories/[id]
    
    Параметры : email, category
    
    Метод: DELETE

#### 5. Добавить затрату  : http://localhost:5000/api/spendings/
    
    Параметры : email, description, money, category, date
    
    Метод: POST

#### 6. Изменить затрату : http://localhost:5000/api/spendings/[id]
    
    Параметры : email, description, money, category, date
    
    Метод: UPDATE

#### 7. Удалить затрату : http://localhost:5000/api/spendings/[id]
    
    Метод: DELETE

#### 8. Добавить зарплату : http://localhost:5000/api/arrivals/
    
    Параметры : email, description, money, date
    
    Метод: POST

#### 9. Изменить зарплату : http://localhost:5000/api/arrivals/[id]
    
    Параметры : email, description, money, date
    
    Метод: UPDATE

#### 10. Удалить зарплату : http://localhost:5000/api/arrivals/[id]

    Метод: DELETE

#### 11. Получить информацию о пользователе: http://localhost:5000/api/board

    Параметры : json : name, email, spendings[{description, money, category, date}], arrivals[{description, money, date}]
    
    Метод: GET

### Error Codes
Success : 200, 201
Error : 400, 403, 404

#### Кто в команде? 
- Михаил Гусев, ИУ7-83 https://github.com/MikeGus
- Наталия Уточкина, ИУ7-83 https://github.com/Unatart

#### Технологический стек
- Back end : Flask + Peewee (PostgreSQL orm)
- Front end : html5, css3, js
- CodeStyle : http://google.github.io/styleguide/
- Инструмент для разработки : PyCharm, WebStorm
- БагТрекер : GitHub
