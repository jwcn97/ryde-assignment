CREATE OR REPLACE FUNCTION updated_at()   
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

drop table if exists users cascade;
create table users (
    id integer primary key generated always as identity,

    name varchar unique,
    dob varchar,
    address varchar,
    latitude decimal,
    longitude decimal,
    description varchar,

    created_at timestamp with time zone default NOW(),
    updated_at timestamp with time zone default NOW()
);

drop type if exists user_type;
create type user_type as (
    id int,
    name varchar,
    dob varchar,
    address varchar,
    latitude decimal,
    longitude decimal,
    description varchar
);

CREATE TRIGGER update_users
BEFORE UPDATE ON users FOR EACH ROW 
EXECUTE PROCEDURE  updated_at();

DROP FUNCTION if exists get_users;
create or replace function get_users()
returns table (
  id int,
  name varchar,
  dob varchar,
  address varchar,
  latitude decimal,
  longitude decimal,
  description varchar
)
language plpgsql    
as $$
begin

  return query
    select  
      u.id,
      u.name,
      u.dob,
      u.address,
      u.latitude,
      u.longitude,
      u.description
    from users as u
  ;

end;$$
;

DROP FUNCTION if exists get_user_by_id;
create or replace function get_user_by_id(_id int)
returns table (
  id int,
  name varchar,
  dob varchar,
  address varchar,
  latitude decimal,
  longitude decimal,
  description varchar
)
language plpgsql    
as $$
begin

  return query
    select  
      u.id,
      u.name,
      u.dob,
      u.address,
      u.latitude,
      u.longitude,
      u.description
    from users as u
    where u.id = _id
  ;

end;$$
;

DROP FUNCTION if exists get_user_by_name;
create or replace function get_user_by_name(_name varchar)
returns table (
  id int,
  name varchar,
  dob varchar,
  address varchar,
  latitude decimal,
  longitude decimal,
  description varchar
)
language plpgsql    
as $$
begin

  return query
    select  
      u.id,
      u.name,
      u.dob,
      u.address,
      u.latitude,
      u.longitude,
      u.description
    from users as u
    where u.name = _name
  ;

end;$$
;

create or replace function delete_user(_id int)
returns int
language plpgsql    
as $$
declare 
  num_rows_deleted int;
begin
  with deleted as (
    delete from users
    where id = _id
    returning *
  ) select count(*) into num_rows_deleted from deleted;

  return num_rows_deleted;
end;$$
;

create or replace function add_user(formData jsonb)
returns int
language plpgsql    
as $$
declare
  num_rows_added int;
  _name varchar;
  _dob varchar;
  _address varchar;
  _latitude decimal;
  _longitude decimal;
  _description varchar;
begin
  select fd.name, fd.dob, fd.address, fd.latitude, fd.longitude, fd.description
  into _name, _dob, _address, _latitude, _longitude, _description
  from jsonb_populate_record(null::user_type, formData) as fd;

  with added as (
    insert into users(
      name,
      dob,
      address,
      latitude,
      longitude,
      description
    )
    VALUES (
      _name,
      _dob,
      _address,
      _latitude,
      _longitude,
      _description
    )
    RETURNING *
  ) select id into num_rows_added from added;

  return num_rows_added;
end;$$
;

drop function if exists update_user;
create or replace function update_user(_id int, formData jsonb)
returns int
language plpgsql    
as $$
declare
  num_rows_updated int;
  _name varchar;
  _dob varchar;
  _address varchar;
  _latitude decimal;
  _longitude decimal;
  _description varchar;
begin
  select fd.name, fd.dob, fd.address, fd.latitude, fd.longitude, fd.description
  into _name, _dob, _address, _latitude, _longitude, _description
  from jsonb_populate_record(null::user_type, formData) as fd;

  with updated as (
    update users as u set
      name = coalesce(_name, u.name),
      dob = coalesce(_dob, u.dob),
      address = coalesce(_address, u.address),
      latitude = coalesce(_latitude, u.latitude),
      longitude = coalesce(_longitude, u.longitude),
      description = coalesce(_description, u.description)
    where u.id = _id
    returning *
  ) select count(*) into num_rows_updated from updated
  ;

  return num_rows_updated;

end;$$
;

drop function if exists find_nearby_users;
create or replace function find_nearby_users(_id int, max_lat decimal, min_lat decimal, max_long decimal, min_long decimal)
returns table (
  id int,
  name varchar,
  dob varchar,
  address varchar,
  latitude decimal,
  longitude decimal,
  description varchar
)
language plpgsql    
as $$
begin

  return query
    select  
      u.id,
      u.name,
      u.dob,
      u.address,
      u.latitude,
      u.longitude,
      u.description
    from users as u
    where u.id != _id
    and u.latitude between min_lat and max_lat
    and u.longitude between min_long and max_long
  ;

end;$$
;