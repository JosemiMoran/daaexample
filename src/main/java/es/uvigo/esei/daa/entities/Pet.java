package es.uvigo.esei.daa.entities;

import static java.util.Objects.requireNonNull;

/**
 * An entity that represents a pet.
 *
 * @author JosemiMoran
 */

public class Pet {
    private int petId;
    private String name;
    private String type;
    private int personId;

    // Constructor needed for the JSON conversion
    Pet() {}

    /**
     * Constructs a new instance of {@link Pet}.
     *
     * @param petId identifier of the pet.
     * @param name name of the pet.
     * @param type type of the pet.
     * @param personId id of the owner.
     */
    public Pet(int petId, String name, String type, int personId) {
        this.petId = petId;
        this.setName(name);
        this.setType(type);
        this.personId = personId;
    }

    /**
     * Returns the identifier of the pet.
     *
     * @return the identifier of the pet.
     */
    public int getPetId() {
        return petId;
    }

    /**
     * Returns the identifier of the owner.
     *
     * @return the identifier of the owner.
     */
    public int getPersonId() {
        return personId;
    }

    /**
     * Returns the name of the pet.
     *
     * @return the name of the pet.
     */
    public String getName() {
        return name;
    }

    /**
     * Set the name of this pet.
     *
     * @param name the new name of the pet.
     * @throws NullPointerException if the {@code name} is {@code null}.
     */
    public void setName(String name) {
        this.name = requireNonNull(name, "Name can't be null");
    }

    /**
     * Returns the type of the pet.
     *
     * @return the type of the pet.
     */
    public String getType() {
        return type;
    }

    /**
     * Set the type of this pet.
     *
     * @param type the new type of the pet.
     * @throws NullPointerException if the {@code surname} is {@code null}.
     */
    public void setType(String type) {
        this.type = requireNonNull(type, "Type can't be null");
    }
}
