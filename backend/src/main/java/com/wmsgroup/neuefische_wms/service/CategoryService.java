package com.wmsgroup.neuefische_wms.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.wmsgroup.neuefische_wms.converter.CategoryConverter;
import com.wmsgroup.neuefische_wms.converter.CategoryOutputDTOConverter;
import com.wmsgroup.neuefische_wms.exception.CategoryNotFoundException;
import com.wmsgroup.neuefische_wms.exception.CategoryNotValidException;
import com.wmsgroup.neuefische_wms.exception.NotBlankException;
import com.wmsgroup.neuefische_wms.model.Category;
import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.dto.CategoryInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.CategoryOutputDTO;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final IdService idService;

    private static final String CATEGORY_NOT_FOUND_MESSAGE_FORMAT = "Kategorie mit id %s existiert nicht.";
    private static final String PARENT_NOT_FOUND_MESSAGE_FORMAT = "Oberkategorie mit id %s existiert nicht.";
    private static final String NEW_NOT_FOUND_MESSAGE_FORMAT = "Neue Kategorie mit id %s existiert nicht.";
    private static final String NO_NULL_CATEGORY_STRING = "Bitte Produkte erst löschen oder verschieben!";
    private static final String NOT_BLANK_MESSAGE_FORMAT = "%s darf nicht leer sein!";

    private static final String PATH_FORMAT = "category/%s/%s";

    private void validateOrThrow(CategoryInputDTO categoryInputDTO, String id, String item) {
        if (id != null && !categoryRepository.existsById(id)) {
            throw new CategoryNotFoundException(String.format(CATEGORY_NOT_FOUND_MESSAGE_FORMAT, id), String.format(PATH_FORMAT, item, ""));
        }
        if (categoryInputDTO == null) {
            return; // nothing to validate if categoryInputDTO is null, so we can skip the rest of the validation code here.
        }

        if (categoryInputDTO.name().isBlank()) {
            throw new NotBlankException(String.format(NOT_BLANK_MESSAGE_FORMAT, "Name"), String.format(PATH_FORMAT, item, "name"));
        }
        if (categoryInputDTO.parentId() != null && !categoryRepository.existsById(categoryInputDTO.parentId())) {
            throw new CategoryNotFoundException(String.format(PARENT_NOT_FOUND_MESSAGE_FORMAT, categoryInputDTO.parentId()), String.format(PATH_FORMAT, item, "parentId"));
        }
    }

    public List<CategoryOutputDTO> getAllCategories() {
        return CategoryOutputDTOConverter.convert(categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "name")))
                .stream()
                .map(categoryOutputDTO ->
                        categoryOutputDTO
                                .withCountSubCategories(categoryRepository.countByParentId(categoryOutputDTO.id()))
                                .withCountProducts(productRepository.countByCategoryId(categoryOutputDTO.id()))

                ).toList();
    }

    public CategoryOutputDTO addCategory(@NonNull CategoryInputDTO categoryInputDTO) {
        validateOrThrow(categoryInputDTO, null, "new");

        return CategoryOutputDTOConverter.convert(
                categoryRepository.save(
                        CategoryConverter.convert(categoryInputDTO)
                                .withId(idService.generateId())
                )
        );
    }

    public CategoryOutputDTO updateCategory(@NonNull String id, @NonNull CategoryInputDTO categoryInputDTO) {
        validateOrThrow(categoryInputDTO, id, id);

        return CategoryOutputDTOConverter.convert(
                categoryRepository.save(
                        CategoryConverter.convert(categoryInputDTO)
                                .withId(id)
                )
        );
    }

    public void deleteCategory(@NonNull String id) {
        validateOrThrow(null, id, id);

        // delete products in category
        productRepository.deleteAllByCategoryId(id);
        // delete all children
        categoryRepository.deleteAllByParentId(id);
        // delete category itself
        categoryRepository.deleteById(id);
    }

    public void deleteCategoryAndMoveChildren(@NonNull String id, String moveToCategoryId) {
        validateOrThrow(null, id, id);

        if (moveToCategoryId != null && !categoryRepository.existsById(moveToCategoryId)) {
            throw new CategoryNotFoundException(String.format(NEW_NOT_FOUND_MESSAGE_FORMAT, moveToCategoryId), String.format(PATH_FORMAT, id, "moveToCategory"));
        }
        // Can't move products to null category
        if (moveToCategoryId == null && productRepository.existsByCategoryId(id)) {
            throw new CategoryNotValidException(NO_NULL_CATEGORY_STRING, String.format(PATH_FORMAT, id, "moveToCategory"));
        }

        // Move products to new category / null check just for type safety
        if (moveToCategoryId != null) {
            List<Product> products = productRepository.findAllByCategoryId(id);
            for (Product product : products) {
                productRepository.save(product.withCategoryId(moveToCategoryId));
            }
        }
        // Move all children to new category
        List<Category> children = categoryRepository.findAllByParentId(id);
        for (Category child : children) {
            categoryRepository.save(child.withParentId(moveToCategoryId));
        }
        // Delete category itself
        categoryRepository.deleteById(id);
    }
}