# Laboratorio_Software_Parte2
En este repositorio se suben los avances realizados en el trabajo de la 2ª parte de Laboratorio de Software

## Base de datos
create table users(user_id integer not null primary key autoincrement unique, username text not null, email text not null unique, role text not null, password text not null);
create table categorias(id integer not null primary key autoincrement unique, name text not null unique, creator text not null);
create table videos(id integer not null primary key autoincrement unique, name text not null unique, creator text not null, url text not null, category text not null);

### Administrador
email: admin@gmail.com
contraseña: admin

### Usuario
email: user@gmail.com
contraseña: user
