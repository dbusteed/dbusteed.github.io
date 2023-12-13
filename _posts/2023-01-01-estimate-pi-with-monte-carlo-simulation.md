---
title: Estimating Pi with Monte Carlo Simulation using Bevy
tags:
  - simulation
  - Rust
  - Bevy
excerpt: Estimate Pi with a fun 3D simulation
description: Estimate Pi with a fun 3D simulation
---

> Run the simulation [here](https://dbusteed.github.io/monte-carlo-pi/)

I stumbled upon a [video](https://www.youtube.com/watch?v=7ESK5SaP-bc) about [Monte Carlo Simulations](https://en.wikipedia.org/wiki/Monte_Carlo_method), where the creator had a cool graphical demonstration of estimating pi with two containers. The first container was a cylinder with a radius of $ r $, and the second was a square box with a side length of $ r $. Balls were randomly dropped in a large space, some of which laneded in the cicular container, and some landed in the square (while others simply landed on the ground). 

The number of balls in the containers can act as a proxy for the container's area, which allows us to compare the areas of the shapes and isolate pi.

$$ \frac{circle}{square} = \frac{\pi r^2}{r^2} = \pi $$

Because the radius of the circular container equals the side length of the square box, this equation is very simple. If these values don't match, you can still estimate pi, you would just need to scale the ratio by the difference in the radius and side length.

One of these days, I'd like to place two containers outside in the rain and run this simulation in the physical world, but in the meantime I decided to make a similar (yet uglier) 3D simulation using Bevy.

Bevy can be a bit verbose, especially when definining the positions of multiple objects, so the snippets below will highlight key components of the simulation. The full source code can be found on [GitHub](https://github.com/dbusteed/monte-carlo-pi).

> **NOTE** I updated the project to use custom 3D models I built in Blender (instead of the built-in `PbrBundle`). Using these assets added extra complexity to the app setup (`AppState`, `SystemSet`, etc), so to keep this post concise I'll keep the original, more simplified version here

## Project Setup

I created a new Rust project with `cargo`, then added Bevy, Bevy Rapier (physics), and the `rand` crate for random numbers.

```bash
$ cargo new monte-carlo-pi
$ cd monte-carlo-pi
$ cargo add bevy bevy_rapier3d rand
```

## Components and Resources

I'll created three "tag components" to mark the rain droplets, the circle container, and the square container.

```rust
#[derive(Component)]
struct Droplet;

#[derive(Component)]
struct Circle;

#[derive(Component)]
struct Square;
```

I also defined a resource named `Data` to keep track of the counts and the pi estimate.

```rust
#[derive(Resource, Default, Debug)]
struct Data {
    circle: usize,
    square: usize,
    pi: f64,
}
```

## Structure the App

Next, I created the app in the `main` function, added the necessary plugins, and added my systems (which I'll go over in the next section).

```rust
fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugin(RapierPhysicsPlugin::<NoUserData>::default())
        // .add_plugin(RapierDebugRenderPlugin::default())
        .insert_resource(Data::default())
        .add_startup_system(setup)
        .add_system(rain)
        .add_system(check_collisions)
        .add_system(despawn_droplets)
        .add_system(update_ui)
        .run();
}
```

## Setup the Scene

I started with the `setup` system which only runs once. This is where I spawn basically everything except for the rain droplets, so it's a bit verbose. I'll simplify things with comments, but feel free to check out [the code](https://github.com/dbusteed/monte-carlo-pi) to see everything.

```rust
fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    asset_server: Res<AssetServer>,
) {
    // spawn the light
    commands.spawn(PointLightBundle { ... });

    // spawn the camera
    commands.spawn(Camera3dBundle { ... });

    // spawn plane where the "containers" sit
    commands.spawn(PbrBundle { ... });

    // spawn the square
    commands
        .spawn(PbrBundle { ... })
        .insert(RigidBody::Fixed)
        .insert(Collider::cuboid( ... ))
        .insert(Sensor) // this makes the collider a Sensor, so balls "fall thru"
        .insert(Square); 

    // spawn the circle
    commands.spawn(PbrBundle { ... }) ...other components // similar to square

    // spawn text for UI
    commands.spawn(TextBundle { ... });
}
```

## Add Rain System

What good is a raining simulation without rain? The `rain` system is pretty straightforward.

When the system runs, it loops thru `0..n` to spawn `n` rain droplets (allowing for more rain and quicker approximations of pi). The important thing here is the `Transform.translation`. For the simulation to work, the droplets need to be spawned uniformally across the space. If the droplets were to spawn more frequently over one of the shapes (or not completely "cover" a shape), we won't get a good pi estimate.

```rust
fn rain(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    // increase this for more rain droplets per step
    for _ in 0..5 {
        commands
            .spawn(PbrBundle {
                mesh: meshes.add(Mesh::from(shape::Capsule {
                    radius: 0.1,
                    depth: 0.0,
                    ..default()
                })),
                transform: Transform::from_xyz(
                    // the plane is 14 x 8, so we spawn anywhere
                    // in the range (plus a little buffer)
                    thread_rng().gen_range(-7.5..=7.5),
                    15.0,
                    thread_rng().gen_range(-4.5..=4.5),
                ),
                material: materials.add(StandardMaterial {
                    base_color: Color::BLUE,
                    perceptual_roughness: 1.0,
                    ..default()
                }),
                ..default()
            })
            .insert(RigidBody::Dynamic)
            .insert(Collider::ball(0.1))
            .insert(Droplet);
    }
}
```

## Find Collisions and Update Pi

Now for the meat of the simulation. This system "watches" the droplets and checks if they have collided with either of the shapes. I would've liked to create actual containers that "catch" the droplets, but I ran into some issues and decided to take this simpler approach.

I found that it was possible for a droplet to be counted twice, so after the droplet collides, I remove it from the scene.

The final step of this system is to esimate pi by dividing the circle count by the square count.

```rust
fn check_collisions(
    mut commands: Commands,
    mut data: ResMut<Data>,
    rapier_context: Res<RapierContext>,
    q_droplet: Query<Entity, With<Droplet>>,
    q_circle: Query<Entity, With<Circle>>,
    q_square: Query<Entity, With<Square>>,
) {
    // grab the two shapes
    let circle = q_circle.get_single().unwrap();
    let square = q_square.get_single().unwrap();

    // run thru each droplet and see it collided
    // with either of our shapes
    for droplet in q_droplet.iter() {
        if rapier_context.intersection_pair(droplet, circle) == Some(true) {
            data.circle += 1;
            commands.entity(droplet).despawn();
        }

        if rapier_context.intersection_pair(droplet, square) == Some(true) {
            data.square += 1;
            commands.entity(droplet).despawn();
        }
    }

    // estimate pi
    if data.square > 0 {
        data.pi = data.circle as f64 / data.square as f64;
    }
}
```

## Cleanup and UI Updates

To finish things off, I created a system to despawn any droplets that have dropped past the plane, otherwise I'd end up with a ton of rain droplets falling forever.

```rust
fn despawn_droplets(mut commands: Commands, q_droplet: Query<(Entity, &Transform), With<Droplet>>) {
    for (drop, trans) in q_droplet.iter() {
        if trans.translation.y < -1.0 {
            commands.entity(drop).despawn();
        }
    }
}
```

And finally, I added a system to update the text object created in the `setup` system with the current data from the aptly named `Data` resource.

```rust
fn update_ui(mut q_text: Query<&mut Text>, data: Res<Data>) {
    let mut text = q_text.get_single_mut().unwrap();
    text.sections[0].value = format!("{} / {} = {:.4}", data.circle, data.square, data.pi);
}
```

## Deploy via WASM

The great thing about Rust + Bevy is that it's super easy to deploy to the web via WASM. I followed the steps from the [Unofficial Bevy Cheat Book](https://bevy-cheatbook.github.io/platforms/wasm.html), generated the `*.js/*.wasm` files, then added them to a simple `index.html`.

After putting my code on GitHub, I pointed the GitHub pages to the main branch, and just like that the app was alive!
