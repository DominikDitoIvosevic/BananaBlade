# An explanation of the server REST API

## API actions

- **/user**, different user actions
    - **/auth**, actions related to user authentication
        - */login*, **(P)**:
            - process user login
        - */register*, **(P)**:
            - process user registration
        - */confirm*, **(G)**:
            - perform user activation via link
    - **/account**, current user's account actions
        - */get*, **(G)**:
            - get user account data
        - */modify*, **(P)**:
            - modify user account data
        - */delete*, **(P)**:
            - delete user account
        - */password*, **(P)**:
            - change account password
- **/admin**, administrative actions
    - **/users**, user management actions
        - */list*, **(G)**:
            - get a list of all application users
        - **/&lt;int:id&gt;**, managing a single user
            - */get/*, **(G)**:
                - get user account data
            - */edit*, **(P)**:
                - change user account data
            - */delete*, **(P)**:
                - delete user account
    - **/editors**, editor management actions
        - */list*, **(G)**:
            - get a list of all editors
        - **/&lt;int:id&gt;**
            - */set*, **(P)**:
                - make user with a given `id` an editor
            - */unset*, **(P)**:
                - unmake user with a given `id` an editor
            - **/slots**
                - **/&lt;int:slot_id&gt;**
                    - */assign*, **(P)**:
                        - assign a slot with a given `slot_id` to the editor with an `id`
                    - */unassign*:
                        - unassign a slot with a given `slot_id` from the editor with an `id`
        - **/requests**, slot requests management
            - */list*, **(G)**:
                - get a list of all pending requests
            - **/&lt;int:request_id&gt;**, individual request management
                - */allow*, **(P)**:
                    - allow the request with a given `id`
                - */deny*, **(P)**:
                    - deny the request with a given `id`
    - **/tracks**, track management
        - */list*, **(G)**:
            - get a list of all tracks
        - */add*, **(P)**:
            - add a new track
        - **/&lt;int:track_id&gt;**, individual track management
            - */get*, **(G)**:
                - get track data
            - */edit*, **(P)**:
                - edit data of a track with a given `track_id`
            - */delete*, **(P)**:
                - delete a track with a given `track_id`
- **/editor**, editorial actions
    - **/&lt;int:id&gt;**, actions of an individual editor
        - **/slots**, managing assigned slots
            - */list*, **(G)**:
                - list all editor's slots
            - */request*, **(P)**:
                - make a request for a time slot(s)
            - **&lt;int:slot_id&gt;**, slot playlist management
                - */get*, **(G)**:
                    - get all tracks on the slot playlist
                - */set*, **(P)**:
                    - set tracks to the slot playlist (overwrite old)
- **/owner**, owner actions
    - **/admins**, managing administrators
        - */list*, **(G)**:
            - get a list of all the admins
        - **/&lt;int:id&gt;**, managing a single admin
            - */set*, **(P)**:
                - make user with a given `id` an admin
            - */unset*, **(P)**:
                - unmake user with a given `id` an admin
    - **/station**, managing radio station data
        - */get*, **(G)**:
            - get radio station data
        - */edit*, **(P)**:
            - change radio station data
- **/stats**, statistics
    - **/wishlist**, wishlist-related statistics
        - */get*, **(G)**:
            - get
    - **/users**, user statistics
        - **/active**, active users stats
            - */count*, **(G)**:
                - get number of currently active users
    - **/admins**, admin statistics
        - **/active**, active admins stats
            - */list*, **(G)**:
                - get a list of all active administrators
    - **/editors**, editor stats
        - **&lt;int:id&gt;**, individual editor
            - **/tracks**
                - **/preferred**
                    - */list*, **(G)**:
                        - get a list of tracks preferred by this editor